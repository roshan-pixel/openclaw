"""
Create a Windows Scheduled Task that runs with highest privileges
"""
import subprocess
import sys
import os


def create_scheduled_task():
    """Create a scheduled task that runs with admin privileges."""
    
    # Get current Python and script paths
    python_exe = sys.executable
    script_path = os.path.join(os.path.dirname(__file__), "scripts", "cli_agent.py")
    
    # XML for scheduled task (runs with highest privileges, no UAC)
    task_xml = f'''<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.2" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>OpenClaw GodMode - Runs with highest privileges</Description>
  </RegistrationInfo>
  <Triggers />
  <Principals>
    <Principal id="Author">
      <UserId>S-1-5-18</UserId>
      <RunLevel>HighestAvailable</RunLevel>
    </Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
    <StartWhenAvailable>false</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>false</RunOnlyIfNetworkAvailable>
    <AllowStartOnDemand>true</AllowStartOnDemand>
    <Enabled>true</Enabled>
    <Hidden>false</Hidden>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>
  </Settings>
  <Actions Context="Author">
    <Exec>
      <Command>{python_exe}</Command>
      <Arguments>"{script_path}"</Arguments>
      <WorkingDirectory>{os.path.dirname(__file__)}</WorkingDirectory>
    </Exec>
  </Actions>
</Task>'''
    
    # Save XML
    xml_path = "openclaw_godmode.xml"
    with open(xml_path, "w", encoding="utf-16") as f:
        f.write(task_xml)
    
    # Create task
    print("Creating GodMode scheduled task...")
    result = subprocess.run(
        ["schtasks", "/Create", "/TN", "OpenClawGodMode", "/XML", xml_path, "/F"],
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print("\n✓ GodMode task created successfully!")
        print("\nTo run OpenClaw with GodMode:")
        print('  schtasks /Run /TN "OpenClawGodMode"')
        print("\nTo delete the task:")
        print('  schtasks /Delete /TN "OpenClawGodMode" /F')
    else:
        print(f"\n✗ Failed to create task: {result.stderr}")
    
    # Clean up XML
    os.remove(xml_path)


if __name__ == "__main__":
    create_scheduled_task()
