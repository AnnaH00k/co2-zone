"use client";
import { useState, useEffect } from "react";
import jsonData from "../data/table.json";
import { ArrowArcLeft, Info } from "@phosphor-icons/react/dist/ssr";
import { ArrowArcRight } from "@phosphor-icons/react";
import { useLocale, useTranslations } from 'next-intl';


export default function Table() {
  interface TableData {
    code?: string;
    country: string;
    CO2_emissions: { [key: string]: number };
    company?: string;
  }
  const t = useTranslations('Table')
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [showCompanies, setShowCompanies] = useState<string>("true");
  const [sortOrder, setSortOrder] = useState<"oldToNew" | "newToOld">(
    "oldToNew"
  );
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [favoritesClicked, setFavoritesClicked] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const locale = useLocale();
  const isArabic = locale === 'ar';

  useEffect(() => {
    const formattedData: TableData[] = jsonData.table.map((item: any) => ({
      code: item.code || "",
      country: item.country || "",
      CO2_emissions: item.CO2_emissions || {},
      company: item.company || "",
    }));
    setTableData(formattedData);
  }, [jsonData]);

  const handleYearClick = (year: string) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter((y) => y !== year));
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };

  // Function to handle scrolling to the left
  const scrollLeft = () => {
    const container = document.getElementById("tableContainer");
    if (container) {
      const newPosition = scrollPosition - 200; // Adjust as needed
      container.scrollLeft = newPosition;
      setScrollPosition(newPosition);
    }
  };

  // Function to handle scrolling to the right
  const scrollRight = () => {
    const container = document.getElementById("tableContainer");
    if (container) {
      const newPosition = scrollPosition + 200; // Adjust as needed
      container.scrollLeft = newPosition;
      setScrollPosition(newPosition);
    }
  };

  const handleCountryClick = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter((c) => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const handleCompanyClick = (company: string) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter((c) => c !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
  };

  const handleFavorites = () => {
    setFavoritesClicked(true);
    const filteredData = tableData.filter((item) => {
      if (
        selectedCountries.includes(item.country) ||
        selectedCompanies.includes(item.company ?? "")
      ) {
        const filteredCO2 = Object.keys(item.CO2_emissions).reduce(
          (acc: { [key: string]: number }, key) => {
            if (selectedYears.includes(key)) {
              acc[key] = item.CO2_emissions[key];
            }
            return acc;
          },
          {}
        );
        return Object.keys(filteredCO2).length > 0;
      }
      return false;
    });
    setTableData(filteredData);
  };

  const allYears = tableData.reduce((acc, curr) => {
    const years = Object.keys(curr.CO2_emissions);
    years.forEach((year) => {
      if (!acc.includes(year)) {
        acc.push(year);
      }
    });
    return acc;
  }, [] as string[]);

  const handleShowData = (value: string) => {
    setShowCompanies(value);
    let filteredData;
    if (value === "true") {
      filteredData = jsonData.table.filter((item: any) => item.company);
    } else if (value === "false") {
      filteredData = jsonData.table.filter((item: any) => item.country);
    } else {
      filteredData = jsonData.table;
    }
    const formattedData: TableData[] = filteredData.map((item: any) => ({
      code: item.code || "",
      country: item.country || "",
      CO2_emissions: item.CO2_emissions || {},
      company: item.company || "",
    }));
    setTableData(formattedData);
  };

  const handleSortChange = (value: string) => {
    if (value === "oldToNew" || value === "newToOld") {
      setSortOrder(value as "oldToNew" | "newToOld");
    }
  };

  const sortedYears = [...allYears].sort((a, b) => {
    if (sortOrder === "oldToNew") {
      return parseInt(a) - parseInt(b);
    } else {
      return parseInt(b) - parseInt(a);
    }
  });

  const handleCO2SortChange = (value: string) => {
    const sortedData = [...tableData].sort((a, b) => {
      const aTotalCO2 = parseFloat(calculateTotalCO2Emissions(a.CO2_emissions));
      const bTotalCO2 = parseFloat(calculateTotalCO2Emissions(b.CO2_emissions));
      if (value === "lowToHigh") {
        return aTotalCO2 - bTotalCO2;
      } else {
        return bTotalCO2 - aTotalCO2;
      }
    });
    setTableData(sortedData);
  };

  const calculateTotalCO2Emissions = (CO2Data: { [key: string]: number }) => {
    let totalCO2 = 0;
    Object.values(CO2Data).forEach((value) => {
      totalCO2 += value;
    });
    return totalCO2.toFixed(2);
  };

  const filteredYears = sortedYears.filter((year) =>
    selectedYears.includes(year)
  );
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  const toggleExplanation = () => {
    setIsExplanationOpen((prev) => !prev);
    setTimeout(() => {
      setIsExplanationOpen(false);
    }, 10000);
  };

  return (
    <div className="justify-center align-center flex items-center w-[100vw] mt-[3vh]">
      <section className="mt-4 w-[90vw] sm:w-[80vw]">
        <div className="flex bg-blueExtraLight justify-end items-center">
          <h2 className="text-lg sm:text-4xl align-center flex justify-center w-full p-3 text-center text-blueDark bg-blueExtraLight">
            {t("header")}
          </h2>

          <Info
            size={24}
            onClick={toggleExplanation}
            className="m-3 text-blueExtraDark sm:absolute"
          />
          {isExplanationOpen && (
            <div
              id="info"
              className="p-4 max-w-[500px] absolute bg-gray-200 text-gray-800 mt-2"
            >
              <button
                className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
                onClick={() => setIsExplanationOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <li>
                {t("info1")}
               
              </li>
              <li>
              {t("info2")}
              </li>
              <li> {t("info3")} </li>
              <li> {t("info4")} </li>
              
            </div>
          )}
        </div>

        <div className={`flex  flex-col  ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'} justify-center bg-blueDark border border-blueExtraLight border-solid border-1 items-center`}>
          <div className={`flex items-center  ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
            <label className="text-blueExtraLight" htmlFor="showData">
               {t("label1")}
            </label>
            <select
              className="bg-blueExtraLight border border-blueExtraLight border-solid border-1 rounded-md text-blueDark p-1 m-1"
              id="showData"
              onChange={(e) => {
                const value = e.target.value;
                if (value === "true") {
                  handleShowData("true");
                } else if (value === "false") {
                  handleShowData("false");
                } else {
                  handleShowData("all");
                }
              }}
            >
              <option value="all">{t("label1Choice1")}</option>
              <option value="true">{t("label1Choice2")} </option>
              <option value="false">{t("label1Choice3")}</option>
            </select>
          </div>

          <div className={`flex items-center  ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
            <label className="text-blueExtraLight" htmlFor="sortData">
              {t("label2")}
            </label>
            <select
              className="bg-blueExtraLight border border-blueExtraLight border-solid border-1 rounded-md text-blueDark p-1 m-1"
              id="sortData"
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="oldToNew">{t("label2Choice1")}</option>
              <option value="newToOld">{t("label2Choice2")}</option>
            </select>
          </div>

          <div className={`flex items-center  ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
            <label className="text-blueExtraLight" htmlFor="sortCO2">
             {t("label3")}
            </label>
            <select
              className="bg-blueExtraLight border border-blueExtraLight border-solid border-1 rounded-md text-blueDark p-1 m-1"
              id="sortCO2"
              onChange={(e) => handleCO2SortChange(e.target.value)}
            >
              <option value="">{t("label3Choice3")}</option>
              <option value="lowToHigh">{t("label3Choice1")}</option>
              <option value="highToLow">{t("label3Choice2")} </option>
            </select>
          </div>
          <div className="bg-blueExtraLight border border-blueExtraLight border-solid border-1 rounded-md text-blueDark p-1 m-1">
            <button onClick={handleFavorites}>{t("handleFavorites")} </button>
          </div>
        </div>

        {/* Add buttons for scrolling */}
        <div className={`flex bg-blueExtraLight  justify-between  `}>
          <button
            className={`flex rounded-full justify-center items-center border border-blueExtraDark p-1 m-1 gap-1 text-xs sm:text-lg `}
            onClick={scrollLeft}
          >
            <ArrowArcLeft size={24} />
            {t("scrollLeft")}
          </button>
          <button
            className={`flex rounded-full justify-center items-center border border-blueExtraDark p-1 m-1 gap-1 text-xs sm:text-lg `}
            onClick={scrollRight}
          >
            {t("scrollRight")} <ArrowArcRight size={24} />
          </button>
        </div>

        <div
          className="list-group-item mb-0"
          id="tableContainer"
          style={{
            overflowX: "auto",
            width: "w-[90vw] sm:w-[80vw]",
            scrollbarColor: "blueExtraLight blueDark",
            scrollBehavior: "smooth",
            scrollbarWidth: "thin",
            zIndex: 1,
          }}
        >
          <table className="bg-blueLight w-[90vw] sm:w-[80vw] text-blueExtraDark text-left text-sm sm:text-xl mb-4 z-1">
            <thead>
              <tr className="border border-blueExtraLight border-solid border-1">
                <th className="border border-blueExtraLight border-solid border-1">
                  {t("code")}
                </th>
                <th className="border border-blueExtraLight border-solid border-1">
                  {t("countryAndCompany")}
                </th>
                {favoritesClicked
                  ? filteredYears.map((year) => (
                      <th
                        key={year}
                        className={`border border-blueExtraLight border-solid border-1 ${
                          selectedYears.includes(year)
                            ? "bg-blueDark text-blueExtraLight"
                            : ""
                        }`}
                        onClick={() => handleYearClick(year)}
                        style={{ cursor: "pointer" }}
                      >
                        {year}
                      </th>
                    ))
                  : sortedYears.map((year) => (
                      <th
                        key={year}
                        className={`border border-blueExtraLight border-solid border-1 ${
                          selectedYears.includes(year)
                            ? "bg-blueDark text-blueExtraLight"
                            : ""
                        }`}
                        onClick={() => handleYearClick(year)}
                        style={{ cursor: "pointer" }}
                      >
                        {year}
                      </th>
                    ))}
                <th className="border border-blueExtraLight border-solid border-1">
                  {t("total")}
                </th>
              </tr>
            </thead>
            <tbody className="z-0">
              {tableData.map((item: TableData, index: number) => (
                <tr
                  key={index}
                  className={`border border-blueExtraLight border-solid border-1 ${
                    selectedCountries.includes(item.country ?? "") ||
                    selectedCompanies.includes(item.company ?? "")
                      ? "bg-blueDark text-blueExtraLight"
                      : ""
                  }`}
                  onClick={() => {
                    if (item.company) {
                      handleCompanyClick(item.company);
                    } else {
                      if (item.country) {
                        handleCountryClick(item.country);
                      }
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <td className="border border-blueExtraLight border-solid border-1">
                    {item.code || "-"}
                  </td>
                  <td className="border border-blueExtraLight border-solid border-1">
                    {item.country || item.company}
                  </td>

                  {favoritesClicked
                    ? filteredYears.map((year) => (
                        <td
                          key={year}
                          className={`border border-blueExtraLight border-solid border-1 ${
                            selectedYears.includes(year)
                              ? "bg-blueDark text-blueExtraLight"
                              : ""
                          }`}
                          onClick={() => handleYearClick(year)}
                          style={{ cursor: "pointer" }}
                        >
                          {item.CO2_emissions[year] || "-"}
                        </td>
                      ))
                    : sortedYears.map((year) => (
                        <td
                          key={year}
                          className={`border border-blueExtraLight border-solid border-1 ${
                            selectedYears.includes(year)
                              ? "bg-blueDark text-blueExtraLight"
                              : ""
                          }`}
                          onClick={() => handleYearClick(year)}
                          style={{ cursor: "pointer" }}
                        >
                          {item.CO2_emissions[year] || "-"}
                        </td>
                      ))}
                  <td className="border border-blueExtraLight border-solid border-1">
                    {calculateTotalCO2Emissions(item.CO2_emissions)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
