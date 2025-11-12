// src/data/seasons.json.ts

export default [
    {
        id: "s1",
        name: "Ramadan",
        startDate: "2024-03-10",
        endDate: "2024-04-09",
        description: "Holy month of fasting and reflection observed by Muslims.",
        boosts: ["zakat", "travel", "quran_daily"],
        color: "#FFD54F"
    },
    {
        id: "s2",
        name: "Eid al-Fitr",
        startDate: "2024-04-10",
        endDate: "2024-04-12",
        description: "Festival marking the end of Ramadan.",
        boosts: ["fund_transfer", "airtime_purchase"],
        color: "#FFB300"
    },
    {
        id: "s3",
        name: "Eid al-Adha",
        startDate: "2024-06-16",
        endDate: "2024-06-18",
        description: "Festival of sacrifice during the Hajj season.",
        boosts: ["fund_transfer", "airtime_purchase"],
        color: "#8E24AA"
    },
    {
        id: "s4",
        name: "Christmas",
        startDate: "2024-12-24",
        endDate: "2024-12-26",
        description: "Christian holiday celebrating the birth of Jesus Christ.",
        boosts: ["travel", "fund_transfer", "bill_payment"],
        color: "#4FC3F7"
    },
    {
        id: "s5",
        name: "New Year",
        startDate: "2024-12-31",
        endDate: "2025-01-01",
        description: "Celebration marking the beginning of a new year.",
        boosts: ["travel", "fund_transfer"],
        color: "#81C784"
    },
    {
        id: "s6",
        name: "Nigeria Independence Day",
        startDate: "2024-10-01",
        endDate: "2024-10-01",
        description: "National holiday celebrating Nigeria's independence.",
        boosts: [],
        color: "#A1887F"
    },
    {
        id: "s7",
        name: "Back-to-School",
        startDate: "2024-09-01",
        endDate: "2024-09-30",
        description: "Season when students return to school after summer break.",
        boosts: ["bill_payment", "loan_request", "savings_goal"],
        color: "#FF8A65"
    },
    {
        id: "s8",
        name: "Black Friday",
        startDate: "2024-11-29",
        endDate: "2024-11-29",
        description: "Major retail discount day following Thanksgiving.",
        boosts: ["airtime_purchase"],
        color: "#F06292"
    },
    {
        id: "s9",
        name: "Hajj Season",
        startDate: "2024-06-12",
        endDate: "2024-06-20",
        description: "Annual pilgrimage season to Mecca.",
        boosts: [],
        color: "#9575CD"
    },
    {
        id: "s10",
        name: "Easter",
        startDate: "2025-04-18",
        endDate: "2025-04-21",
        description: "Christian holiday celebrating the resurrection of Jesus Christ.",
        boosts: [],
        color: "#90CAF9"
    },
];
