const inquirer = require('inquirer');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})
const open = require('open');


// answer 1
const duplicateItems = arr => {
  let arr_sort = arr.slice().sort();
  let res = [];
  for (let i = 0; i < arr_sort.length - 1; i++) {
    if (arr_sort[i + 1] == arr_sort[i]) {
      if (arr_sort[i] && !res.includes(arr_sort[i])) res.push(
        arr_sort[i]);
    }
  }
  return res;
}


// answer 2
const delayShow = arr => {
  let i = 1;
  arr.forEach((item, index) => {
    i = index ? i * 2 : i;
    let time = i * 1000;
    setTimeout(() => {
      console.log(`item : ${item}\ntime: ${time}ms\n`)
    }, time);
  });
}


// answer 4
const bracketValidate = async() => {
  let validate = (input) => {
    let brackets = "[]{}()<>"
    let control = []
    for (let bracket of input) {
      let bracketsIndex = brackets.indexOf(bracket)
      if (bracketsIndex % 2 === 0) {
        control.push(bracketsIndex + 1)
      } else {
        if (control.pop() !== bracketsIndex) {
          return false;
        }
      }
    }
    return control.length === 0
  }
  var prompts = [{
    type: 'input',
    name: 'text',
    message: "Text to check :",
  }]
  await inquirer.prompt(prompts).then(res => {
    console.log(
    validate(res.text) ? 
      "Brackets closed correctly" : 
      "Error: there are brackets that are not closed"
    );
  });
}


// answer 5
const droppedEgg = (n, e) => {
  if (n < 2 || e == 1) return n;
  var min = n;
  for (var i = 1; i <= n; i++) {
    var tmpMax = 1 + Math.max(droppedEgg(i - 1, e - 1), droppedEgg(n - i, e));
    if (tmpMax <= min) {
      min = tmpMax;
    }
  }
  return min;
}


// answer 7
const carrotCalculate = async() => {
  const prompts = [{
    type: 'input',
    name: 'capacity',
    message: "Capacity :",
  }]
  const carrotItems = async(inputs = []) => {
    let promptsArr = [{
      type: 'number',
      name: 'kg',
      message: 'Enter carrot item (kg): '
    }, {
      type: 'number',
      name: 'price',
      message: 'Enter carrot item (price): '
    }, {
      type: 'confirm',
      name: 'again',
      message: 'another carrot? ',
      default: true
    }];
    const {
      again,
      ...answers
    } = await inquirer.prompt(promptsArr);
    const newInputs = [...inputs, answers];
    return again ? carrotItems(newInputs) : newInputs;
  }
  await inquirer.prompt(prompts).then(async res => {
    let items = await carrotItems();
    console.log('capacity: ', res.capacity);
    console.log(items);
    console.log(getMaxValue(items, res.capacity));
  });
}


const createArray = async(inputs = []) => {
  const prompts = [{
    type: 'input',
    name: 'inputValue',
    message: 'Enter array item: '
  }, {
    type: 'confirm',
    name: 'again',
    message: 'another item? ',
    default: true
  }];
  const {
    again,
    ...answers
  } = await inquirer.prompt(prompts);
  const newInputs = [...inputs, answers.inputValue];
  return again ? createArray(newInputs) : newInputs;
};


const getMaxValue = (carrotTypes, capacity) => {
  carrotTypes.map((item, i) => {
    let value;
    value = item.price / item.kg
    carrotTypes[i].value = value;
  });
  let carrotTypesNew = carrotTypes.slice(0);
  carrotTypesNew.sort(function(a, b) {
    return b.value - a.value;
  });
  let lastArray = [];
  let currentWeight = 0;
  for (i = 0; i < carrotTypesNew.length; i++) {
    currentWeight = currentWeight + carrotTypesNew[i].kg;
    lastArray.push(carrotTypesNew[i])
  }
  if ((capacity - currentWeight) % lastArray[0].kg !== 0) {
    do {
      lastArray.push(carrotTypesNew[1]);
      currentWeight = currentWeight + carrotTypesNew[1].kg;
    }
    while ((capacity - currentWeight) % lastArray[0].kg !== 0 && currentWeight <= capacity - carrotTypesNew[1].kg);
  }
  if ((capacity - currentWeight) % lastArray[0].kg === 0) {
    let n = (capacity - currentWeight) / lastArray[0].kg
    for (i = 0; i < n; i++) {
      if (currentWeight <= capacity) {
        lastArray.push(carrotTypesNew[0]);
        currentWeight = currentWeight + carrotTypesNew[0].kg;
      }
    }
  }
  return lastArray;
}



module.exports = {
  // answer export
  export: function() {
    rl.question(
      'Which answer do you want to see? \n(table index): ',
      async function(res) {
        let inp = Number(res);
        switch (inp) {
          case 1:
            let array = await createArray();
            console.log('Array data, created by you: ', array);
            console.log('\nDublicate items: ', duplicateItems(array));
            break;
          case 2:
            let delayArr = await createArray();
            await new Promise(() => delayShow(delayArr));
            break;
          case 3:
            await open('interface/index.html');
            break;
          case 4:
            await new Promise(() => bracketValidate());
            break;
          case 5:
            let math = droppedEgg(100, 2);
            console.log("Minimum worst case number of drops: " + math);
            break;
          case 7:
            await carrotCalculate();
            //await new Promise(() => carrotCalculate());
            break;
          default:
            console.log('So Sorry 😨')
            break;
        }
        rl.close();
      });
  }
};