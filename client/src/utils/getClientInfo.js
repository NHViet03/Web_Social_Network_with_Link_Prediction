const getClientInfo = async () => {
  const ipResponse = await fetch("https://api.ipify.org?format=json");
  const ipData = await ipResponse.json();

  const devideResponse = await fetch(
    `https://ipinfo.io/${ipData.ip}?token=28c92794bdfac3`
  );
  const devideData = await devideResponse.json();

  const devideInfo = {
    platform: navigator.userAgentData.platform || navigator.platform,
    ip: ipData.ip,
    country: devideData.country,
    city: devideData.city,
    lat: devideData.loc.split(",")[0],
    lon: devideData.loc.split(",")[1],
    access_date: Date.now(),
  };

  console.log(devideInfo);

  return devideInfo;
};


export default getClientInfo;
