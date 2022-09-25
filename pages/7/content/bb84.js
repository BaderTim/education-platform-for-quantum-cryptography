
// Alice Input Fields
const activeInputAliceBits = document.getElementById("alice-bits");
const activeInputAliceBitsError = document.getElementById("alice-bits-error");
const activeInputAliceBases = document.getElementById("alice-bases");
const activeInputAliceBasesError = document.getElementById("alice-bases-error");
const inputAliceBasesShared = document.getElementById("alice-bases-shared");
const inputAliceQubits = document.getElementById("alice-qubits");
const inputSharedQubits = document.getElementById("shared-qubits");
// Bob Input Fields
const activeInputBobBases = document.getElementById("bob-bases");
const activeInputBobBasesError = document.getElementById("bob-bases-error");
const inputBobBasesShared = document.getElementById("bob-bases-shared");
const inputBobResult = document.getElementById("bob-result");


//
// Global Variables & Functions
//

const maxLength = 16;
let aliceBitError = false;
let aliceBaseError = false;
let bobBaseError = false;

function verifyInput(target, regex) {
  if (!target.value.match(regex)) {
    // remove latest character if not matching regex
    target.value = target.value.split("").splice(0, target.value.length - 1).join("");
  } 
}

// startup methods
updateAliceBases();
updateBobBases();


//
// Event Listeners for Active Input Fields
//

// ALICE INPUT BITS
activeInputAliceBits.addEventListener("input", (event) => {
  const target = event.target;
  verifyInput(event.target, /^[0-1]*$/);
  if (target.value.length > maxLength) {
    target.setAttribute("class", "form-control border border-danger");
    activeInputAliceBitsError.setAttribute("class", "text-danger");
    aliceBitError = true;
    return;
  } else {
    target.setAttribute("class", "form-control");
    activeInputAliceBitsError.setAttribute("class", "text-danger d-none");
    aliceBitError = false;
  }
  updateAliceBases();
  updateBobBases();
});

// ALICE INPUT BASES
activeInputAliceBases.addEventListener("input", updateAliceBases);
function updateAliceBases() {
  const target = activeInputAliceBases;
  target.value = target.value.toUpperCase();
  verifyInput(target, /^[XZ]*$/);
  if (target.value.length !== activeInputAliceBits.value.length) {
    target.setAttribute("class", "form-control border border-danger");
    activeInputAliceBasesError.setAttribute("class", "text-danger");
    aliceBaseError = true;
    return;
  } else {
    target.setAttribute("class", "form-control");
    activeInputAliceBasesError.setAttribute("class", "text-danger d-none");
    aliceBaseError = false;
  }
  const aliceQubits = getQubitStateFromBit(activeInputAliceBits.value.split(""), activeInputAliceBases.value.split(""));
  inputAliceQubits.value = aliceQubits; 
  inputSharedQubits.value = aliceQubits;
  inputAliceBasesShared.value = target.value;
  document.getElementById("bob-alice-qubits").value = aliceQubits;
  updateTables();
}

// BOB INPUT BASES
activeInputBobBases.addEventListener("input", updateBobBases);
function updateBobBases() {
  const target = activeInputBobBases;
  target.value = target.value.toUpperCase();
  verifyInput(target, /^[XZ]*$/);
  inputBobBasesShared.value = target.value;
  if (target.value.length !== activeInputAliceBits.value.length) {
    target.setAttribute("class", "form-control border border-danger");
    activeInputBobBasesError.setAttribute("class", "text-danger");
    bobBaseError = true;
    return;
  } else {
    target.setAttribute("class", "form-control");
    activeInputBobBasesError.setAttribute("class", "text-danger d-none");
    bobBaseError = false;
  }
  updateTables();
}

function updateTables() {
  if(aliceBitError || aliceBaseError || bobBaseError) {
    return;
  }
  updateBaseTables();
}

function updateBaseTables() {
  const aliceInput = document.getElementById("alice-bits").value.split("");
  const aliceBase = document.getElementById("alice-bases").value.split("");
  const aliceQubits = document.getElementById("alice-qubits").value.split("");
  const bobBase = document.getElementById("bob-bases").value.split("");
  const same = [];
  aliceBase.forEach((base, index) => {
    if (base === bobBase[index]) {
      same.push(index);
    }
  });
  const bobMeasurements = measureQubitsWithBase(aliceQubits, bobBase);
  inputBobResult.value = bobMeasurements.join("");

  const baseTBody = getBaseTBody(aliceBase, bobBase, same);

  const aliceBaseTable = document.getElementById("alice-base-table");
  aliceBaseTable.appendChild(baseTBody.cloneNode(true));
  aliceBaseTable.removeChild(aliceBaseTable.getElementsByTagName("tbody")[0]);

  const bobBaseTable = document.getElementById("bob-base-table");
  bobBaseTable.appendChild(baseTBody);
  bobBaseTable.removeChild(bobBaseTable.getElementsByTagName("tbody")[0]);

  const aliceResultTable = document.getElementById("alice-result-table");
  aliceResultTable.appendChild(getResultTBody("Alice's Input", aliceInput, same));
  aliceResultTable.removeChild(aliceResultTable.getElementsByTagName("tbody")[0]);

  const bobResultTable = document.getElementById("bob-result-table");
  bobResultTable.appendChild(getResultTBody("Bob's Messung", bobMeasurements, same));
  bobResultTable.removeChild(bobResultTable.getElementsByTagName("tbody")[0]);
}


//
// Generate tables
//

function getBaseTBody(aliceBase, bobBase, same) {
  const tbody = document.createElement("tbody");

  // alice bases
  const trowAlice = document.createElement("tr");
  const thAlice = document.createElement("th");
  thAlice.setAttribute("class", "text-black text-start");
  thAlice.innerHTML = "Alice's Basen";
  trowAlice.append(thAlice);
  aliceBase.forEach((base, index) => {
    const td = document.createElement("td")
    if (same.includes(index)) {
      td.setAttribute("class", "text-success fw-bold");
    } 
    td.innerHTML = base;
    trowAlice.append(td);
  });
  tbody.append(trowAlice);

  // bob bases
  const trowBob = document.createElement("tr");
  const thBob = document.createElement("th");
  thBob.setAttribute("class", "text-black text-start");
  thBob.innerHTML = "Bob's Basen";
  trowBob.append(thBob);
  bobBase.forEach((base, index) => {
    const td = document.createElement("td")
    if (same.includes(index)) {
      td.setAttribute("class", "text-success fw-bold");
    } 
    td.innerHTML = base;
    trowBob.append(td);
  });
  tbody.append(trowBob);

  // index
  const trowIndex = document.createElement("tr");
  const thIndex = document.createElement("th");
  thIndex.setAttribute("class", "text-black text-start");
  thIndex.innerHTML = "Index";
  trowIndex.append(thIndex);
  aliceBase.forEach((base, index) => {
    const td = document.createElement("td")
    if (same.includes(index)) {
      td.setAttribute("class", "text-success fw-bold");
    } 
    td.innerHTML = index+1;
    trowIndex.append(td);
  });
  tbody.append(trowIndex);
  return tbody;
}

function getResultTBody(title, input, same) {
  
  const tbody = document.createElement("tbody");

  // index
  const trowIndex = document.createElement("tr");
  const thIndex = document.createElement("th");
  thIndex.setAttribute("class", "text-black text-start");
  thIndex.innerHTML = "Index";
  trowIndex.append(thIndex);
  input.forEach((base, index) => {
    const td = document.createElement("td")
    if (same.includes(index)) {
      td.setAttribute("class", "fw-bold");
      td.innerHTML = index+1;
    } 
    trowIndex.append(td);
  });
  tbody.append(trowIndex);

  // alice input / bobs measurement
  const trowInput = document.createElement("tr");
  const thInput = document.createElement("th");
  thInput.setAttribute("class", "text-black text-start");
  thInput.innerHTML = title;
  trowInput.append(thInput);
  input.forEach((base, index) => {
    const td = document.createElement("td")
    if (same.includes(index)) {
      td.setAttribute("class", "fw-bold");
    } 
    td.innerHTML = base;
    trowInput.append(td);
  });
  tbody.append(trowInput);

  // result
  const trowRes = document.createElement("tr");
  const thRes = document.createElement("th");
  thRes.setAttribute("class", "text-black text-start");
  thRes.innerHTML = "Schlüssel";
  trowRes.append(thRes);
  input.forEach((input, index) => {
    const td = document.createElement("td")
    if (same.includes(index)) {
      td.setAttribute("class", "text-success fw-bold");
      td.innerHTML = input;
    } 
    trowRes.append(td);
  });
  tbody.append(trowRes);

  return tbody;
}


//
// Calc Qubits
//

function getQubitStateFromBit(input, base) {
  const res = [];
  input.forEach((bit, index) => {
    if (bit === "0") {
      if (base[index] === "X") {
        res.push("+");
      } else {
        res.push("0");
      }
    } else { // bit = 1
      if (base[index] === "X") {
        res.push("-");
      } else {
        res.push("1");
      }
    }
  });
  return res.join("");
}

function measureQubitsWithBase(input, base) {
  const res = [];
  input.forEach((qubit, index) => {
    if (base[index] === "X") {
      switch(qubit) {
        case "+":
          res.push("0");
          break;
        case "-":
          res.push("1");
          break;
        case "0":
          res.push("1");
          break;
        case "1":
          res.push("0");
          break;
        default:
          res.push("?");
      }
    } else { // Z
      switch(qubit) {
        case "+":
          res.push("1");
          break;
        case "-":
          res.push("0");
          break;
        case "0":
          res.push("0");
          break;
        case "1":
          res.push("1");
          break;
        default:
          res.push("?");
      }
    }
  });
  return res;
}