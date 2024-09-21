



// Get and save data with Local Storage


let dataModelStorage = [];

async function getLocalStorage() {
    try {
        const storedData = localStorage.getItem('chartsData');

        if (storedData) {
            return JSON.parse(storedData);
        }

        const defaultData = Array.from({ length: 34 }, () => Array(6).fill(''));
        localStorage.setItem('chartsData', JSON.stringify(defaultData));

        return defaultData;
    } catch (error) {
        console.error('Error fetching data from localStorage:', error);
    }
}

async function saveDataToLocalStorage() {
    try {
        localStorage.setItem('chartsData', JSON.stringify(dataModelStorage));
        console.log('Данные успешно сохранены в localStorage');
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
    }
}

function bindInputEventsStorage() {
    const tableBody = document.getElementById('table-rows');
    const tableRows = tableBody.querySelectorAll('tr');

    for (let i = 0; i < tableRows.length; i++) {
        const inputs = tableRows[i].querySelectorAll('input');
        
        inputs.forEach((input, index) => {
            input.addEventListener('change', function () {
                dataModelStorage[i][index] = input.value;
                saveDataToLocalStorage(); 
            });
        });
    }
}

async function getTableRowsStorage() {
    dataModelStorage = await getLocalStorage(); 
    const tableBody = document.getElementById('table-rows');
    const tableRows = tableBody.querySelectorAll('tr');

    for (let i = 0; i < tableRows.length; i++) {
        const inputs = tableRows[i].querySelectorAll('input');

        for (let j = 0; j < inputs.length; j++) {
            inputs[j].value = dataModelStorage[i][j]; 
        }
    }
}

async function mainStorage() {
    await getTableRowsStorage(); 
    bindInputEventsStorage(); 
    console.log('Final data model after binding inputs:', dataModelStorage); 
}


mainStorage();


function createChart(){
    const main = document.getElementById('main');
    const confirmation = document.createElement('div');

    const confirmationMenu = document.createElement('div');
    confirmation.id = 'confirmation';
    confirmationMenu.classList.add('confirmation-menu');

    const divBtns = document.createElement('div');
    divBtns.classList.add('divBtns')
    divBtns.appendChild(document.createElement('button'));
    divBtns.appendChild(document.createElement('button'));
    const buttons = divBtns.querySelectorAll('button');
    for(let i = 0; i < buttons.length; i++){
        buttons[i].classList.add('conf-buttons');
        if(i === 0){
            buttons[i].innerText = 'Create';
            buttons[i].addEventListener('click', function(){
                saveNewChart()
            })
        }
        else{
            buttons[i].innerText = 'Cancel';
            buttons[i].addEventListener('click', function(){
                cancelCreatingChart()
            })
        }
    }

    const text = document.createElement('p');
    text.innerText = 'Create new table';
    text.classList.add('conf-text')
    confirmationMenu.appendChild(text)
    const input = document.createElement('input');
    input.placeholder = 'Set name'
    input.classList.add('setname-input')
    confirmationMenu.appendChild(input);

    confirmationMenu.appendChild(divBtns);

    confirmation.classList.add('confirmation');
    confirmation.appendChild(confirmationMenu)
    main.appendChild(confirmation);
}






function createRows(){
    const tableBody = document.getElementById('table-rows');

    for(let i = 0; i < 34; i++){
        let row = document.createElement("tr");
        
        for(let index = 0; index < 7; index++){
            let data = document.createElement("td");
            let input = document.createElement("input")
            if(index === 0){
                input.type = 'date'
                input.style.width = '100%'
            }
            else{
                  input.type = 'number'
            }
          
            if(index === 3){
                input.classList.add("ut-color");
            }
            else if(index === 4){
                input.classList.add("dt-color");
            }
            data.appendChild(input)
            row.appendChild(data);
        }
        tableBody.appendChild(row);
    }
}








createRows();

async function getAPI(){
    const response = await fetch('http://localhost:3000/api/get-charts')
    if(!response.ok){
        throw new Error('Failed to get')
    }
    const data = await response.json();
    return data;
}

async function displayCharts(){
    const menu = document.getElementById('menu-content');
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
    let currentChartIndex = null;
    let currentChartNumberIndex = null;

    for(let i = 0; i < allContainers.length; i++){
        const numCont = allContainers[i].querySelectorAll('.number');
        for(let num of numCont){
            const numbers = num.querySelectorAll('div')
            numbers.forEach((number,index) =>{
                number.addEventListener('click', function(event){
                    dataModel = [];
                    pointsModel = [];
                    event.stopPropagation();
                    
                    currentChartIndex = i;
                    currentChartNumberIndex = index;
                    
                    const values = res.charts[i].curCharts[index].values;
                    const pivotPoints = values.map(item => ({
                        point: item.point,
                        color: item.color
                      }));
                    const tables = values.map(item => item.table);
                    showDataTable(tables, pivotPoints)
                    bindInputEventsTable();
                    pointChoice()
                    console.log(pointsModel)
                
                    // Обновление данных для графика
                    let pointColors = [];

                    for(let point of pointsModel){
                        if(point.color === 'none'){
                            pointColors.push('rgba(54, 162, 235, 1)')
                        }
                        else if(point.color === 'red'){
                            pointColors.push('rgb(255, 0, 0)')
                        }
                        else{
                            pointColors.push('rgb(0, 0, 0)')
                        }
                       
                    }
                    // console.log(pointColors);

                    let lineData = [];
                    let labelsData = [];
                    for(let data of dataModel){
                        for(let i = 1; i < data.length; i++){
                            if(data[i] !== 0){
                                lineData.push(data[i])
                            }
                        }
                        for(let j = 0; j < 1; j++){
                            labelsData.push(data[j])
                        }

                    }
                    let mergedLineData = [];
                    let mergedLabelsData = [];

                    for(let dt of res.charts[i].curCharts){
                        for(let t of dt.values){
                            for(let p of t.table){
                                if(t.table.indexOf(p) !== 0){
                                    if(p !== 0){
                                        mergedLineData.push(p);
                                        mergedLabelsData.push(t.table[0]);
                                    }
                                }
                               
                                
                            }
                               
                            
                        }
                    }
                    console.log(mergedLabelsData.length);
                    console.log(mergedLineData.length);
                   

                    const mergeButton = document.getElementById('line-merge');
                    mergeButton.addEventListener('click', function(){
                        myChart.data.datasets[0].label = res.charts[i].stocks;
                        myChart.data.datasets[0].data = mergedLineData;
                        myChart.data.datasets[0].pointBackgroundColor = pointColors;
                        myChart.data.labels = mergedLabelsData;
                        myChart.update();
                    });


                    // for(let dt of res.charts[i].curCharts){
                    //     for(let t of dt.values){
                    //         console.log(t)
                    //     }
                    // }

                    // console.log(labelsData);
                    myChart.data.datasets[0].label = res.charts[i].stocks;
                    myChart.data.datasets[0].data = lineData;
                    myChart.data.datasets[0].pointBackgroundColor = pointColors;
                    myChart.data.labels = labelsData;
                    myChart.update();
                })
            })
        }  
    }

    const button = document.getElementById('save-btn');
    button.onclick = function(){
        if (currentChartIndex !== null && currentChartNumberIndex !== null) {
            res.charts[currentChartIndex].curCharts[currentChartNumberIndex].values = dataModel.map((item, index) => {
                return {
                    table: item,
                    point: pointsModel[index].point,
                    color: pointsModel[index].color
                };
            });
            saveDataToServers(res);
        } else {
            console.log('No chart selected');
        }
    };
}

function bindInputEventsTable() {
    const tableBody = document.getElementById('table-rows');
    const tableRows = tableBody.querySelectorAll('tr');

    for (let i = 0; i < tableRows.length; i++) {
        const inputs = tableRows[i].querySelectorAll('input');
        
        inputs.forEach((input, index) => {
            input.onchange = function () {
                if(index === 0){
                    dataModel[i][index] = input.value;  
                }
                else{
                    dataModel[i][index] = Number(input.value);  
                }
                
            };
        });
    }
}

let dataModel = [];
let pointsModel = [];

function pointChoice(){ 
    const tableBody = document.getElementById('table-rows');
    const tableRows = tableBody.querySelectorAll('tr');
    const tableContainer = document.getElementById('main-container');
    
    for(let i = 0; i < tableRows.length; i++){
        const inputs = tableRows[i].querySelectorAll('input');

        for(let j = 1; j < inputs.length; j++){
            inputs[j].oncontextmenu = function(event){
                event.preventDefault();
                const existingChoices = document.getElementById('choice');
                if (existingChoices) {
                    existingChoices.remove();
                }
                const choices = document.createElement('div');
                choices.id = 'choice';
                
                const setRedPoint = document.createElement('button');
                setRedPoint.id = 'red-btn';
                setRedPoint.innerText = 'Set Red Point';

                const setBlackPoint = document.createElement('button');
                setBlackPoint.id = 'black-btn';
                setBlackPoint.innerText = 'Set Black Point';

                const removePoint = document.createElement('button');
                removePoint.id = 'remove-btn';
                removePoint.innerText = 'Remove Point';

                const cancelButton = document.createElement('button');
                cancelButton.id = 'cancel-btn';
                cancelButton.innerText = 'Cancel';

                const textChoices = document.createElement('span');
                textChoices.innerText = 'Set a Pivot Point';
                textChoices.id = 'text-choice';


                removePoint.addEventListener('click', function(){
                    const lastPoint = pointsModel[i].point;
                    inputs[lastPoint].classList.remove('black-point')
                    inputs[lastPoint].classList.remove('red-point');

                    pointsModel[i].point = 7;
                    pointsModel[i].color = 'none';

                    choices.remove();
                })


                setRedPoint.addEventListener('click', function(){
                    const lastPoint = pointsModel[i].point;
                    
                    if(lastPoint !== 7){
                        inputs[lastPoint].classList.remove('black-point')
                        inputs[lastPoint].classList.remove('red-point');
                    }

                    pointsModel[i].point = j;
                    pointsModel[i].color = 'red';
                    inputs[j].classList.add('red-point')
                    choices.remove();
                })

                setBlackPoint.addEventListener('click', function(){
                    const lastPoint = pointsModel[i].point;
                    if(lastPoint !== 7){
                        inputs[lastPoint].classList.remove('black-point')
                        inputs[lastPoint].classList.remove('red-point')
                    }

                    pointsModel[i].point = j;
                    pointsModel[i].color = 'black';
                    inputs[j].classList.add('black-point')
                    choices.remove();
                })

                choices.appendChild(textChoices)
                choices.appendChild(setRedPoint);
                choices.appendChild(setBlackPoint);
                choices.appendChild(removePoint)
                choices.appendChild(cancelButton);

                cancelButton.addEventListener('click', function(){
                    choices.remove();
                })
                choices.classList.add('choices');
                tableContainer.appendChild(choices);
            }
        }
    }
}

function showDataTable(data, points){
    const tableBody = document.getElementById('table-rows');
    const tableRows = tableBody.querySelectorAll('tr');
    for(let i = 0; i < tableRows.length; i++){
        const inputs = tableRows[i].querySelectorAll('input');
        
        const row =  findRowData(data, i + 1);
        const point = findPoint(points, i + 1)
        pointsModel[i] = point;
        dataModel[i] = row;
        console.log(inputs.length)
        for(let j = 0; j < inputs.length; j++){   
            inputs[j].value = row[j];
            inputs[j].classList.remove('red-point', 'black-point', 'none');

            if(point.point === j){
                if(point.color === 'red'){
                    inputs[j].classList.add('red-point');
                }
                else if(point.color === 'black'){
                    inputs[j].classList.add('black-point');
                }
            } else {
                inputs[j].classList.add('none');
            }
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

function findPoint(data, i){
    return data[i - 1] || {point: 7, color: 'none'};
}


function findRowData(data, i){
    return data[i - 1] || [0,0,0,0,0,0,0];
}

function createChart(){
    const main = document.getElementById('main');
    const confirmation = document.createElement('div');

    const confirmationMenu = document.createElement('div');
    confirmation.id = 'confirmation';
    confirmationMenu.classList.add('confirmation-menu');

    const divBtns = document.createElement('div');
    divBtns.classList.add('divBtns')
    divBtns.appendChild(document.createElement('button'));
    divBtns.appendChild(document.createElement('button'));
    const buttons = divBtns.querySelectorAll('button');
    for(let i = 0; i < buttons.length; i++){
        buttons[i].classList.add('conf-buttons');
        if(i === 0){
            buttons[i].innerText = 'Create';
            buttons[i].addEventListener('click', function(){
                saveNewChart()
            })
        }
        else{
            buttons[i].innerText = 'Cancel';
            buttons[i].addEventListener('click', function(){
                cancelCreatingChart()
            })
        }
    }

    const text = document.createElement('p');
    text.innerText = 'Create new table';
    text.classList.add('conf-text')
    confirmationMenu.appendChild(text)
    const input = document.createElement('input');
    input.placeholder = 'Set name'
    input.classList.add('setname-input')
    confirmationMenu.appendChild(input);

    confirmationMenu.appendChild(divBtns);

    confirmation.classList.add('confirmation');
    confirmation.appendChild(confirmationMenu)
    main.appendChild(confirmation);
}

function cancelCreatingChart(){
    const main = document.getElementById('confirmation');
    main.remove();
}

async function saveNewChart(){
    try {
        const res = await getAPI()
        const main = document.getElementById('confirmation');
        const value = main.querySelector('input')
        if(value.value !== ''){
            res.charts.push({stocks: value.value, curCharts: [{
                number: 0,
                values: []
            }]})

            const responsePost = await fetch('http://localhost:3000/api/save-charts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(res)
            });

            if (!responsePost.ok) {
                throw new Error('Failed to POST data');
            }

            const responseData = await responsePost.json();
            console.log('Данные успешно сохранены:', responseData);
        }
        else{
            console.log('Enter name before creating')
        }
    }catch (error) {
        console.error('Ошибка при сохранении данных на сервер:', error);
    }   
}

const button = document.getElementById('create-button');
button.addEventListener('click', function(){
    createChart();
})

extendChartDiv(); 


toDisplay();

const ctx = document.getElementById('myChart').getContext('2d');
const newData = [10, 5, 15, 8, 6, 4, 9];
const myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: newData.map((_, index) => index + 1),
          datasets: [{
              data: newData,
              borderColor: '#ffffff',
              borderWidth: 2,
              pointBorderWidth: 0,
              pointRadius: 5,
              pointHitRadius: 5,
              pointHoverRadius: 10,
              fill: false
          }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
          scales: {
            x: {
                ticks: {
                    color: '#ffffff'  
                }
            },
              y: {
                  beginAtZero: true,
                  ticks: {
                    color: '#ffffff'  
                }
              }
          },
          plugins: {
              legend: {
                  labels: {
                      color: '#ffffff' 
                  }
              }
          }
      }
  });


function toDisplay(){
  const displayButton = document.getElementById('line-btn');
  const saveButton = document.getElementById('save-btn');
  const mergeButton = document.getElementById('line-merge');
  displayButton.addEventListener('click', function(){

      const tableContainer = document.getElementById('table-cont');
      tableContainer.classList.add('hidden');
  
        const mainContainer = document.getElementById('main-container');
        mainContainer.classList.add('overflow');

      const displayContainer = document.getElementById('graph-cont');
      displayContainer.classList.remove('hidden');
      displayContainer.classList.add('flex');

    mergeButton.classList.remove('hidden');
    saveButton.classList.add('hidden');

      displayButton.classList.add('hidden');

      const hideButton = document.getElementById('line-hid');
      hideButton.classList.remove('hidden');
      hideButton.addEventListener('click', function(){
        displayContainer.classList.add('hidden');
        tableContainer.classList.remove('hidden');
        displayButton.classList.remove('hidden');
        hideButton.classList.add('hidden');
        displayContainer.classList.remove('flex');
        mainContainer.classList.remove('overflow');


        mergeButton.classList.add('hidden');
        saveButton.classList.remove('hidden');
    
  
      })
  
  })
}  


