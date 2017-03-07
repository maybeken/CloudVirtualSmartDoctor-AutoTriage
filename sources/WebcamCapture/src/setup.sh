#!/bin/bash

DIR=$(pwd)
WHO=$(whoami)

clear
echo -e "Please read the following text carefully.\n"
echo -e "This script is for setting up the webcam of the Raspberry Pi.\n"
echo -e "Requirements:"
echo -e "- Internet Access\n- Root Access via \"sudo\"\n- AWS CLI Credentials\n- AWS IoT Credentials\n"
echo -e "- Enable \"Wait for Network at Boot\" in \"raspi-config\"\n- Confirm you are using the correct user. ($WHO)\n- Confirm you are in the correct directory ($DIR/setup.sh)\n"
echo -e "Please ensure you met all the requirements above before continue.\n"
read -p "Press any key to continue... (Ctrl + C to quit)"$'\n'$'\n' -n1 -s

if [ "$(whoami)" == "root" ]; then
	echo -e "Please don't run this script with root permission.\n"
	exit 1
else
	echo -e "No root permission confirmed, proceed...\n"
fi

if [ !ping -c 1 8.8.8.8 &> /dev/null ]; then
	echo -e "Internet connection is down, please review the network connection.\n"
else
	echo -e "Internet connection is up, proceed...\n"
fi

echo -e "Installing necessary dependencies... (This may take a while...)\n"
sudo apt-get update && sudo apt-get install fswebcam nodejs npm awscli -y
echo -e "\nInstallation finished.\n"

echo -e "Checking AWS CLI configuration...\n"
while [ ! -r "/home/$WHO/.aws/config" ]; do
	echo -e "Please follow the instruction on screen to configure AWS CLI.\n"
	aws configure
done
echo -e "AWS CLI configurated.\n"

mkdir -p certs
echo -e "AWS IoT credentials checks...\n"
while ( [ ! -r "./certs/private.pem.key" ] && [ ! -r "./certs/certificate.pem.crt" ] && [ ! -r "./certs/root-CA.crt" ] ) do
	echo -e "Please place your IoT device credentials inside the \"./certs\" folder."
	echo -e "Private Key: private.pem.key"
	echo -e "Client Certificate: certificate.pem.crt"
	echo -e "AWS IoT CA Certificate: root-CA.crt\n"
	read -p "Press any key to continue... "$'\n'$'\n' -n1 -s
done
echo -e "AWS IoT credentials check finished.\n"

echo -e "Installing Node.js dependencies...\n"
npm install
echo -e "\nInstallation finished.\n"

echo -e "Seting up rc.local for auto-run script.\n"
if ( ! grep -qR "webcam" "/etc/rc.local" ) then
	sudo sed -i -e '$i \cd '$DIR' && su '$WHO' -c "node '$DIR'/main.js" &\n' /etc/rc.local
fi
echo -e "Setup finished.\n"

echo -e "All setup ready."
echo -e "Use \"node $DIR/main.js\" to start the IoT script manually."
exit 1