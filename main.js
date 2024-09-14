

function createRows(){
    const tableBody = document.getElementById('table-rows');

    for(let i = 0; i < 34; i++){
        let row = document.createElement("tr");
        
        for(let index = 0; index < 6; index++){
            let data = document.createElement("td");
            let input = document.createElement("input")
            input.type = 'number'
            if(index === 2){
                input.classList.add("ut-color");
            }
            else if(index === 3){
                input.classList.add("dt-color");
            }
            data.appendChild(input)
            row.appendChild(data);
        }
        tableBody.appendChild(row);
    }
}

createRows();



// Get and save data with Local Storage


// let dataModelStorage = [];

// async function getLocalStorage() {
//     try {
//         const storedData = localStorage.getItem('chartsData');

//         if (storedData) {
//             return JSON.parse(storedData);
//         }

//         const defaultData = Array.from({ length: 34 }, () => Array(6).fill(''));
//         localStorage.setItem('chartsData', JSON.stringify(defaultData));

//         return defaultData;
//     } catch (error) {
//         console.error('Error fetching data from localStorage:', error);
//     }
// }

// async function saveDataToLocalStorage() {
//     try {
//         localStorage.setItem('chartsData', JSON.stringify(dataModelStorage));
//         console.log('Данные успешно сохранены в localStorage');
//     } catch (error) {
//         console.error('Error saving data to localStorage:', error);
//     }
// }

// function bindInputEventsStorage() {
//     const tableBody = document.getElementById('table-rows');
//     const tableRows = tableBody.querySelectorAll('tr');

//     for (let i = 0; i < tableRows.length; i++) {
//         const inputs = tableRows[i].querySelectorAll('input');
        
//         inputs.forEach((input, index) => {
//             input.addEventListener('change', function () {
//                 dataModelStorage[i][index] = input.value;
//                 saveDataToLocalStorage(); 
//             });
//         });
//     }
// }

// async function getTableRowsStorage() {
//     dataModelStorage = await getLocalStorage(); 
//     const tableBody = document.getElementById('table-rows');
//     const tableRows = tableBody.querySelectorAll('tr');

//     for (let i = 0; i < tableRows.length; i++) {
//         const inputs = tableRows[i].querySelectorAll('input');

//         for (let j = 0; j < inputs.length; j++) {
//             inputs[j].value = dataModelStorage[i][j]; 
//         }
//     }
// }

// async function mainStorage() {
//     await getTableRowsStorage(); 
//     bindInputEventsStorage(); 
//     console.log('Final data model after binding inputs:', dataModelStorage); 
// }


// mainStorage();



async function getAPI(){
    const response = await fetch('http://localhost:3000/api/get-charts')
    if(!response.ok){
        throw new Error('Failed to get')
    }
    const data = await response.json();
    return data;
}


async function displayCharts(){
    const menu = document.getElementById('menu');
    const data = await getAPI();
    for(let chart of data.charts){
        let displaiedChart = document.createElement('div'); 
        
        
        displaiedChart.innerText = chart.stocks;
        displaiedChart.classList.add('name')
        let nameBase = document.createElement('div')
        nameBase.appendChild(displaiedChart)
        nameBase.classList.add('one-chart')

        let nameContainer = document.createElement('div');

        for(let c of chart.curCharts){
            let chartCount = document.createElement('div');
            chartCount.innerText = c.number + 1;
           
           
        
            nameContainer.appendChild(chartCount);
            
        }
        nameContainer.classList.add('number');
        nameContainer.classList.add('hide-chart');
        nameBase.appendChild(nameContainer);
       
        menu.appendChild(nameBase);


    }   
}



async function extendChartDiv(){
    await displayCharts();
    
    const divs =  document.querySelectorAll('.one-chart');
    
    divs.forEach((div, index) => {
        div.addEventListener('click', function(){
            const chartCount = div.querySelectorAll('.number');
            const nameCount = div.querySelectorAll('.name');
            if (div.style.height === '7rem') {
                div.style.height = '3rem';
                
                for(let chart of chartCount){
                    chart.classList.add('hide-chart');
                    chart.classList.remove('number-flex')
                }
                for(let name of nameCount){
                    name.style.height = '100%'
                }
              
                
            } else {
                div.style.height = '7rem'; 
                for(let chart of chartCount){
                    chart.classList.remove('hide-chart');
                    chart.classList.add('number-flex')
                    
                }
                for(let name of nameCount){
                    name.style.height = '30%'
                }
              
            }
        })
    })
    const res = await getAPI()
    const allContainers = document.querySelectorAll('.one-chart')
    for(let i = 0; i < allContainers.length; i++){
        const numCont = allContainers[i].querySelectorAll('.number');
        for(let num of numCont){
            const numbers = num.querySelectorAll('div')
            numbers.forEach((number,index) =>{
            number.addEventListener('click', function(event){
                dataModel = []
                event.stopPropagation();
                showDataTable(res.charts[i].curCharts[index].values)
                bindInputEventsTable()
                res.charts[i].curCharts[index].values = dataModel;
                const button = document.getElementById('save-btn');
                button.addEventListener('click', function(){
                    saveDataToServers(res)
                })
                
                console.log(res.charts[i].curCharts[index].values)
                let lineData = []
                for(let data of dataModel){
                   for(let d of data){
                    if(d !== 0){
                        lineData.push(d)
                    }
                  
                   }
                }
                
                myChart.data.datasets[0].data = lineData;

               
                myChart.data.labels = lineData.map((_, index) => index + 1);
                myChart.update();
                // console.log(lineData)
                
                
                
                
            })
        })
        }
      
        
    }



    

}


function bindInputEventsTable() {
    const tableBody = document.getElementById('table-rows');
    const tableRows = tableBody.querySelectorAll('tr');

    for (let i = 0; i < tableRows.length; i++) {
        const inputs = tableRows[i].querySelectorAll('input');
        
        inputs.forEach((input, index) => {
            input.addEventListener('change', function () {
                dataModel[i][index] = Number(input.value); 
                
                
                // saveDataToServers(inx, dx);
                
            });
        });
    }
}

// Get Data from server

let dataModel = [];



function showDataTable(data){
    const tableBody = document.getElementById('table-rows');
    const tableRows = tableBody.querySelectorAll('tr');
    for(let i = 0; i < tableRows.length; i++){
        const inputs = tableRows[i].querySelectorAll('input');
        
        const row =  findRowData(data, i + 1);

        dataModel[i] = row;
        for(let j = 0; j < inputs.length; j++){
           
            
                inputs[j].value = row[j]
            
        }

    }

}

async function saveDataToServers(data) {

    try {
        const responsePost = await fetch('http://localhost:3000/api/save-charts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(data)
        });

        if (!responsePost.ok) {
            throw new Error('Failed to POST data');
        }

        const responseData = await responsePost.json();
        console.log('Данные успешно сохранены:', responseData);
    }catch (error) {
        console.error('Ошибка при сохранении данных на сервер:', error);
    }    
}



// showDataTable()

function findRowData(data, i){
    return data[i - 1] || ['','','','','',''];
}


async function convertDataModel(){

    // let lineData = []
    // for(let data of dataModel){
    //     lineData = data.forEach(i => {
    //         if(!i === 0){
    //             lineData.push(i)
    //         }
    //     })
        
    // }
    // console.log(lineData)


    
}

extendChartDiv(); 


const ctx = document.getElementById('myChart').getContext('2d');
const newData = [10, 5, 15, 8, 6, 4, 9];
const myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: newData.map((_, index) => index + 1), // Автоматическая генерация индексов как меток
          datasets: [{
              data: newData, // Данные для графика
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: false
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true // Начало оси Y с 0
              }
          }
      }
  });














