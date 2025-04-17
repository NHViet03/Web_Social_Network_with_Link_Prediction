import FingerprintJS from "@fingerprintjs/fingerprintjs";

const countryMapping = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua and Barbuda",
  ZW: "Zimbabwe",
  VN: "Vietnam",
};

const getClientInfo = async () => {
  const ipResponse = await fetch("https://api.ipify.org?format=json");
  const ipData = await ipResponse.json();

  const deviceResponse = await fetch(
    `https://ipinfo.io/${ipData.ip}?token=28c92794bdfac3`
  );
  const deviceData = await deviceResponse.json();

  const fpPromis = FingerprintJS.load();

  const fp = await fpPromis;

  const result = await fp.get();

  const deviceInfo = {
    deviceId: result.visitorId,
    networkIp: ipData.ip,
    browserInfo: navigator.userAgent,
    deviceName: navigator.userAgentData?.platform || navigator.platform,
    country: countryMapping[deviceData.country] || deviceData.country,
    city: deviceData.city,
    accessDate: Date.now(),
  };

  // Save device id to local storage
  const existingDeviceId = localStorage.getItem("deviceId");

  if (!existingDeviceId || existingDeviceId !== deviceInfo.deviceId) {
    localStorage.setItem("deviceId", deviceInfo.deviceId);
  }

  return deviceInfo;
};

export default getClientInfo;
