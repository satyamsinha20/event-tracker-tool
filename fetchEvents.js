const axios = require("axios");
const { CITIES } = require("./config");
const { getSheet, generateEventId, isExpired } = require("./sheet");
const askCity = require("./cityInput");

async function runFetcher() {
  const selectedCity = await askCity();
  const cityName = CITIES[selectedCity];

  if (!cityName) {
    console.log("Invalid city selected");
    return;
  }

  const sheet = await getSheet();
  const rows = await sheet.getRows();

  const existingMap = new Map();
  rows.forEach(row => existingMap.set(row.event_id, row));

  try {
    const url =
      `https://in.bookmyshow.com/api/explore/v1/discover/events?city=${selectedCity}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    const events = response.data?.events || [];

    for (const event of events) {
      const eventId = generateEventId(
        event.title,
        event.eventDate,
        event.venueName,
        selectedCity
      );

      const status = isExpired(event.eventDate)
        ? "Expired"
        : "Active";

      if (existingMap.has(eventId)) {
        const row = existingMap.get(eventId);
        row.status = status;
        row.last_updated = new Date().toISOString();
        await row.save();
      } else {
        await sheet.addRow({
          event_id: eventId,
          event_name: event.title || "",
          date: event.eventDate || "",
          venue: event.venueName || "",
          city: cityName,
          category: event.category || "Event",
          url: event.eventUrl || "",
          status,
          last_updated: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.error(`Error fetching events for ${cityName}`, error.message);
  }
}

module.exports = runFetcher;
