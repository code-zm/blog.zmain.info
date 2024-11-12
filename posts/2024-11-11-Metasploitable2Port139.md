2024-11-11

Tags: [[cybersecurity]], [[pentesting]]

#### Port 139
Runs a NetBIOS Session Service and is often used by SMB (Server message block) protocol. SMB is a protocol primarily used for file sharing, printer sharing, and network browsing. Samba, the open source implementation of SMB, is widely used on linux systems to provide SMB functionality. 

#### Samba Usermap Script Vulnerability (CVE-2007-2447)
The vulnerability is a command injection flaw in Samba's usermap script. Samba allows admins to define custom mappings between Unix users and SMB users via the username map. However, a flaw in this feature allows an attacker to inject arbitrary commands by manipulating the script's output. 

Basic Vulnerbaility Flow:
1. Samba's `usermap` feature is used to map incoming SMB usernames to specific Unix accounts. 
2. By crafting a specially formatted username, an attacker can inject commands that Samba will execute on the system with the priveleges of the Samba service (often root)

#### High Level Strategy for Exploitation
1. Confirm that Samba is running and determine the version. You can use `smb_version` auxiliary scanner in Metasploit. 
2. If running a vulnerable version, use CVE-2007-2447
3. Use `usermap_script` in Metasploit to run the exploit and gain shell access


#### Walkthrough
On Kali, Launch Metasploit with `msfconsole`:
![[Pasted image 20241111223338.png]]

Search for the auxiliary SMB scanner with `search smb_version`:
![[Pasted image 20241111223449.png]]

Select it with `use 0` then enter the command `show options` to see the parameters:
![[Pasted image 20241111223551.png]]
This shows us that we just need to specify `RHOSTS`. We will enter the IP address of the Metasploitable2 target machine with `set RHOSTS <ipAddress>`. 

Then enter the command `exploit` to launch the scanner:
![[Pasted image 20241111223759.png]]
This shows us that it's running Samba 3.0.20. This is compatible with CVE-2007-2447. 

Now, let's select the Samba exploit. Search `search cve-2007-2447`:
![[Pasted image 20241111223943.png]]

Select it with `use 0`, then enter `show options` to see the parameters:
![[Pasted image 20241111224039.png]]
This shows us that we only need to set the RHOSTS. Do this with the same command from earlier `set RHOSTS <ipAddress>`

Next, enter `exploit` to launch the attack:![[Pasted image 20241111224441.png]]

We have successfully opened a reverse shell on the target machine! Enter the command `whoami` to determine your level of privelege:
![[Pasted image 20241111224545.png]]
Root access basically means we have free reign to do whatever we want on the machine. From here we can establish persistence, attempt lateral movement, or exfiltrate sensitive data.









## References