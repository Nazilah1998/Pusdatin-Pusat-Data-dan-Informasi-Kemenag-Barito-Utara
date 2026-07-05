require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const os = require('os');
const { execSync } = require('child_process');

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("❌ DATABASE_URL is not set in .env.local");
  process.exit(1);
}

// Function to calculate CPU usage across all cores (fallback if 'top' is not available)
function getCpuUsageFallback() {
  const cpus = os.cpus();
  let user = 0, nice = 0, sys = 0, idle = 0, irq = 0;
  for (let cpu in cpus) {
    user += cpus[cpu].times.user;
    nice += cpus[cpu].times.nice;
    sys += cpus[cpu].times.sys;
    idle += cpus[cpu].times.idle;
    irq += cpus[cpu].times.irq;
  }
  const total = user + nice + sys + idle + irq;
  const active = total - idle;
  return Math.round((active / total) * 100);
}

function getMetrics() {
  let cpu = 0, ram = 0, storage = 0, uptimeStr = 'N/A';
  let cpuCores = os.cpus().length;
  let ramUsedGb = 0, ramTotalGb = 0, storageUsedGb = 0, storageTotalGb = 0;
  
  const isWin = os.platform() === 'win32';

  try {
    // === RAM (Cross-platform) ===
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    ram = Math.round(((totalMem - freeMem) / totalMem) * 100);
    
    ramTotalGb = (totalMem / (1024 ** 3)).toFixed(2);
    ramUsedGb = ((totalMem - freeMem) / (1024 ** 3)).toFixed(2);

    if (isWin) {
      // === Windows Fallbacks (For Local Testing) ===
      cpu = Math.round(Math.random() * 20 + 20); // Mock CPU: 20-40%
      storage = Math.round(Math.random() * 5 + 40); // Mock Storage: 40-45%
      
      storageTotalGb = "50.00";
      storageUsedGb = (50 * (storage / 100)).toFixed(2);
      
      const uptimeSeconds = os.uptime();
      const hours = Math.floor(uptimeSeconds / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);
      uptimeStr = `${hours} hours, ${minutes} minutes`;
    } else {
      // === Linux / Debian Native Commands ===
      // Uptime
      try { 
        uptimeStr = execSync(`uptime -p`).toString().trim().replace('up ', ''); 
      } catch (e) {
        uptimeStr = 'Unknown';
      }
      
      // CPU
      try {
        const topOutput = execSync(`top -bn1 | grep "Cpu(s)"`).toString();
        const match = topOutput.match(/(\d+\.\d+)\s*us,\s*(\d+\.\d+)\s*sy/);
        if (match) {
          cpu = Math.round(parseFloat(match[1]) + parseFloat(match[2]));
        } else {
          cpu = getCpuUsageFallback();
        }
      } catch (e) { 
        cpu = getCpuUsageFallback();
      }

      // Storage (Root partition)
      try {
        const dfOutput = execSync(`df -B1 /`).toString().split('\n')[1].trim().split(/\s+/);
        // Output looks like: /dev/sda1  50000000  20000000  28000000  42% /
        // index 1 = total, index 2 = used, index 4 = percentage
        if (dfOutput.length >= 5) {
          storageTotalGb = (parseInt(dfOutput[1]) / (1024 ** 3)).toFixed(2);
          storageUsedGb = (parseInt(dfOutput[2]) / (1024 ** 3)).toFixed(2);
          
          const match = dfOutput[4].match(/(\d+)%/);
          if (match) {
            storage = parseInt(match[1]);
          }
        }
      } catch (e) {}
    }
  } catch (err) {
    console.error("⚠️ Error getting OS metrics:", err.message);
  }

  return { cpu, ram, storage, uptimeStr, cpuCores, ramUsedGb, ramTotalGb, storageUsedGb, storageTotalGb };
}

async function startMonitor() {
  console.log("🚀 Starting Pusdatin Server Monitor...");
  const client = new Client({ connectionString: dbUrl });
  
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL Database!");
    
    // Counter to clean up old logs every hour
    let runCount = 0;
    const runsPerHour = Math.round(3600 / 10);

    setInterval(async () => {
      const { cpu, ram, storage, uptimeStr, cpuCores, ramUsedGb, ramTotalGb, storageUsedGb, storageTotalGb } = getMetrics();
      
      try {
        await client.query(
          `INSERT INTO kemenag_pusdatin.system_metrics (cpu, ram, storage, uptime, cpu_cores, ram_used_gb, ram_total_gb, storage_used_gb, storage_total_gb) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [cpu, ram, storage, uptimeStr, cpuCores, ramUsedGb, ramTotalGb, storageUsedGb, storageTotalGb]
        );
        console.log(`[${new Date().toLocaleTimeString()}] Metrics -> CPU: ${cpu}% | RAM: ${ramUsedGb}/${ramTotalGb}GB | Storage: ${storageUsedGb}/${storageTotalGb}GB`);
        
        runCount++;
        
        // Clean up data older than 2 days, run every hour
        if (runCount >= runsPerHour) {
          runCount = 0;
          await client.query(
            `DELETE FROM kemenag_pusdatin.system_metrics WHERE recorded_at < NOW() - INTERVAL '2 days'`
          );
          console.log(`🧹 Cleaned up old metrics (> 2 days)`);
        }
      } catch (err) {
        console.error("❌ Database Insert Error:", err.message);
      }
    }, 10000); // Run every 10 seconds
    
  } catch (err) {
    console.error("❌ Failed to connect to Database:", err.message);
    process.exit(1);
  }
}

startMonitor();
