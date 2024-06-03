import React, { useState, useEffect, createRef, useRef } from "react";
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import { Line } from "react-chartjs-2";
import { ReactTabulator } from "react-tabulator";
import 'react-tabulator/lib/styles.css'
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';


ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);




const Dashboard = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [tableRows, setTableRows] = useState([]);
  const [laptopData, setLaptopData] = useState([]);
  const [badgeData, setBadgeData] = useState([]);
  const [supplyChartData, setSupplyChartData] = useState({ labels: [], datasets: [] });  
  const [suppliesData, setSuppliesData] = useState([]);
  const [view, setView] = useState("computers");
  const [numOfLoans, setNumOfLoans] = useState(0);
  const [numOfBadges, setNumOfBadges] = useState(0);
  const [options, setOptions] = useState({});
  const [pastLoans, setPastLoans] = useState(true);
  const date = new Date();

  useEffect(() => {
      const handleResize = debounce(() => {
          console.log('Resize event triggered');
      }, 200);

      window.addEventListener('resize', handleResize);
      return () => {
          window.removeEventListener('resize', handleResize);
      };
  }, []);

  useEffect(() => {
    fetchData();
    console.log("hello");
    console.log(view)
  }, [view, pastLoans]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/${view ==="badges" ? "students" : view}`);
      console.log('reponsedata')
      console.log(response.data);
      console.log(view);
      if (view === "computers") {
        const laptopRows = response.data;
        let newArr;
        if (pastLoans) {
          newArr = laptopRows.flatMap((row) => {
            return row.loans.map((loan) => {
              return {
                type: row.model,
                name: loan.name,
                startDate: loan.startDate ? new Date(loan.startDate).toISOString().split('T')[0] : 'N/A',
                endDate: loan.endDate ? new Date(loan.endDate).toISOString().split('T')[0] : 'N/A',
              };
            });
          });
        }else{
          newArr = laptopRows
          .filter((row) => row.status === "Loaned")
          .map((row) => {
            const tempLoan = row.loans[row.loans.length - 1];
            return {
              type: row.model,
              name: tempLoan.name,
              startDate: tempLoan.startDate? new Date(tempLoan.startDate).toISOString().split('T')[0]  : 'N/A',
              endDate: tempLoan.endDate? new Date(tempLoan.endDate).toISOString().split('T')[0]  : 'N/A',
            };
          });
        }
        setLaptopData(newArr);
        setNumOfLoans(newArr.length);
        console.log(newArr);
      } else if (view === "badges") {
        const newArr = response.data.map((row) => {
          return {
            type: row.badgeName,
            name: row.studentName,
            location: row.location
          }
          
        })
        console.log(newArr);
        setBadgeData(newArr);
        setNumOfBadges(newArr.length);
      } else {
        const newArr = response.data.map((row) => {
          return {
            area: row.buildingLocation,
            cost: row.estimatedCost,
            location: row.buildingLocation,
            quantity: row.quantityInStock,
            reorderLevel: row.reorderLevel,
            reorderQuantity: row.reorderQuantity,
            unit: row.unit,
            vendor: row.vendor,
            sku: row.sku,

          }
          
        })
        console.log(newArr);
        setSuppliesData(newArr);

        if (Array.isArray(newArr)){
            const chartLabels = newArr.map((supply) => supply.sku);
            const chartData = newArr.map((supply) => supply.cost);
    
            const data = {
              labels: chartLabels,
              datasets: [
                {
                  label: 'Total Cost',
                  data: chartData,
                  borderWidth: 3,
                  backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
                },
              ],
            }; 
            setSupplyChartData(data); // get data to the donut component
            console.log(supplyChartData);
    
            const chartOptions  = {
              plugins: {
             datalabels: {
                formatter: (value, context) => {
                  const label = context.chart.data.labels[context.dataIndex];
                  return `${label}: ${value}`;
                },
                  color: "white",
                  
                  font: {
                    
                    weight: 'bold',
                    size:14,
                    family: 'Arial',
                  },
                },
                responsive: true,
              },
              cutout: data.map((item) => item.cutout),
            };
    
            setOptions(chartOptions);
          }
        
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function changeView(view) {
    setView(view);
    
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const laptopColumns = [
    { title: "Model", field: "type", width: 200 },
    { title: "Issued To", field: "name", hozAlign: "left" },
    { title: "Start Date", field: "startDate", hozAlign: "left" },
    { title: "End Date", field: "endDate", hozAlign: "left" },
    { title: "Days Loaned", field: "daysLate", hozAlign: "left" },
  ];

  const badgeColumns = [
    { title: "Badge Name", field: "type", width: 350 },
    { title: "Name", field: "name", hozAlign: "left" },
    { title: "Location", field: "location", hozAlign: "left" },
  ];

  const supplyColumns = [
    { title: "SKU", field: "sku"},
    { title: "Quantity", field: "quantity", width: 150 },
    { title: "Unit", field: "unit", hozAlign: "left" },
    { title: "Building Location", field: "location", hozAlign: "left" },
    { title: "Area", field: "area", hozAlign: "center" },
    { title: "Reorder Level", field: "reorderLevel", hozAlign: "left" },
    { title: "Reorder Quantity", field: "reorderQuantity", hozAlign: "center" },
    { title: "Vendor", field: "vendor", hozAlign: "center" },
    { title: "Cost", field: "cost", hozAlign: "center" },
  ];


  const rowFormatter = (row) => {
    const rowData = row.getData();
    console.log(rowData);
    const endDate = new Date(rowData.endDate);
  };

  const calculateDaysLate = (value, data, type, params, component) => {
    const currentdate = new Date();
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    let divider;
    if (endDate) {
      const endDateObj = new Date(endDate);
      if (!isNaN(endDateObj.getTime())) {
        divider = endDateObj.getTime();
      } else {
        divider = currentdate.getTime();
      }
    } else {
      divider = currentdate.getTime();
    }
    console.log(endDate.getTime());
    console.log(divider);
    const diffTime = (divider - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  let laptopTableRef = useRef(null);

  const columns = [
    { title: 'Column 1', field: 'col1' },
    { title: 'Column 2', field: 'col2' },
    { title: 'Column 3', field: 'col3' },
    // Add more columns as needed
  ];

  const data = [
    { id: 1, col1: 'Data 1', col2: 'Data 2', col3: 'Data 3' },
    // Add more data rows as needed
  ];
  return (
    <div>
      <div className="flex mr-10">
        <SideNav />
        <div className="ml-10 mt-[15rem] flex flex-col  items-center w-full ">
          <div className="">
          <label >View: </label>
            <select className="mx-2 px-2 py-1 border border-gray-300 rounded-md"onChange={e => setView(e.target.value)} >
              <option value="computers">Loans</option>
              <option value="badges">Badges</option>
              <option value="supplies">Supplies</option>
            </select>
          </div>
          {view == "computers" && (
            <> 
              <div>
                <div className="mt-5 flex flex-col items-center text-center">
                  <h1 className="text-customOrange text-4xl mt-5" >{numOfLoans}</h1>
                  <h2 className="text-xl mt-2">{pastLoans ? 'Total Loans' : 'Current Loans'}</h2>
                </div>
                <div>
                  <div className="hover:text-customOrange cursor-pointer  mt-5" >
                    {pastLoans ? <p onClick={() => {setPastLoans(false)}}>Switch to Current Loans</p> :
                        <p onClick={() => {setPastLoans(true)}}>Switch to All Loans</p>
                    } 
                    <div></div>
                  </div>
                 
                    <ReactTabulator
                    onRef={(r) => (laptopTableRef = r)}
                    data={laptopData}
                    columns={laptopColumns.map((col) =>
                      col.field === "daysLate"
                        ? { ...col, mutator: calculateDaysLate }
                        : col
                    )}
                    layout={"fitColumns"}
                    rowFormatter={rowFormatter}
                  />

                  
                </div>
              </div>
            </>
          )}
          {view == "badges" && (
            <div >
              <div  className="mt-5 mb-5 flex flex-col items-center text-center">
                  <h1 className="text-customOrange text-4xl mt-5">{numOfBadges}</h1>
                  <h2 className="text-xl mt-2">Current Badges</h2>
                </div>
              
              <ReactTabulator data={badgeData} columns={badgeColumns} layout={"fitColumns"} />
            </div>
          )}
          {view == "supplies" && (
            <div className="mt-5">
              <ReactTabulator  data={suppliesData} columns={supplyColumns} layout={"fitColumns"} />
              <div className="w-100 flex justify-center mt-5">
                <Doughnut data={supplyChartData} options={options} />
              </div>            
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;