export const worldElectricityProduction = [
  {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    gas: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    coal: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    year: 2009,
  },
  {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    gas: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    coal: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    year: 2010,
  },
  {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    gas: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    coal: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    year: 2011,
  },
  {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    gas: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    coal: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    year: 2012,
  },
  {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    gas: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    coal: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    year: 2013,
  },
  {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    gas: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    coal: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    year: 2014,
  },
  {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    gas: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    coal: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    year: 2015,
  },

  {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    gas: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    coal: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    year: 2016,
  },
  {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    gas: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    coal: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    year: 2017,
  },
  {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    gas: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    coal: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    year: 2018,
  },
  {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    gas: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    coal: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    year: 2019,
  },
  {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    gas: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    coal: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    year: 2020,
  },
  {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    gas: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    coal: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    year: 2021,
  },
  {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    gas: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    coal: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    year: 2022,
  },
];

export const nuclearConsumptionData = Array.from({ length: 15 }, (_, index) => {
  const day = String(index + 1).padStart(2, "0");
  return {
    country: "World",
    nuclear: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    date: `2024-07-${day}`, // Format: "YYYY-MM-DD"
  };
});

export const suppliersData = Array.from({ length: 5 }, (_, index) => {
  const day = String(index + 1).padStart(2, "0");
  const things = [
    "primary.main",
    "secondary.main",
    "success.main",
    "warning.main",
  ];
  return {
    label: "Supplier " + (index + 1),
    value: Math.floor(Math.random() * (3000 - 1000 + 1) + 1000),
    productCategories: things[Math.floor(Math.random() * things.length)],
  };
});
