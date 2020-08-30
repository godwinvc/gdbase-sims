const fs = require("fs");
const xljson = require("xls-to-json");
xljson(
  {
    input: "sims.xls", // input xls
    output: "output.json", // output json
    sheet: "Simulation 7" // specific sheetname
  },
  function(err, result) {
    if (err) {
      console.error(err);
    } else {
      //   console.log(convertToSim(result));
      fs.writeFile("sim7.json", JSON.stringify(convertToSim(result)), function(
        err
      ) {
        if (err) throw err;
        console.log("Added Sim!");
      });
    }
  }
);

const convertToSim = output => {
  let simJSON = {};
  let curQues = 0;
  let curQuesType = "";
  output.forEach(obj => {
    if (obj.QuestionNum != "") {
      curQues = "Q" + obj.QuestionNum;
      simJSON[curQues] = {};
      simJSON[curQues].questionText = obj.Question;
      switch (obj.Type) {
        case '"several good answer"':
          simJSON[curQues].questionType = "MR";
          curQuesType = "MR";
          break;
        case '"only one good answer"':
          simJSON[curQues].questionType = "MC";
          curQuesType = "MC";
          break;
        case '"True or false"':
          simJSON[curQues].questionType = "TF";
          curQuesType = "TF";
          break;
        default:
          console.error("Unknown question type: " + curQues);
          break;
      }
    } else if (obj.Answers != "") {
      switch (curQuesType) {
        case "MR":
          buildMRorMC(curQues, obj, simJSON);
          break;
        case "MC":
          buildMRorMC(curQues, obj, simJSON);
          break;
        case "TF":
          buildTF(curQues, obj, simJSON);
          break;
        default:
          console.error("Unknown question type: " + curQues);
          break;
      }
    }
  });
  return simJSON;
};

const buildMRorMC = (Qnum, obj, simJSON) => {
  if (!simJSON[Qnum].options) {
    simJSON[Qnum].options = {};
    simJSON[Qnum].options.Op1 = {};
    simJSON[Qnum].options.Op1.text = obj.Answers;
    if (obj["Good answer"] == "") {
      simJSON[Qnum].options.Op1.type = "incorrect";
    } else {
      simJSON[Qnum].options.Op1.type = "correct";
    }
    simJSON[Qnum].options.Op1.mark = Math.abs(parseFloat(obj.Marks));
  } else {
    let curOp = "Op" + (Object.keys(simJSON[Qnum].options).length + 1);
    simJSON[Qnum].options[curOp] = {};
    simJSON[Qnum].options[curOp].text = obj.Answers;
    if (obj["Good answer"] == "") {
      simJSON[Qnum].options[curOp].type = "incorrect";
    } else {
      simJSON[Qnum].options[curOp].type = "correct";
    }
    simJSON[Qnum].options[curOp].mark = Math.abs(parseFloat(obj.Marks));
  }
  return simJSON;
};
const buildTF = (Qnum, obj, simJSON) => {
  if (!simJSON[Qnum].options) {
    simJSON[Qnum].options = {};
    simJSON[Qnum].options.Op1 = {};
    simJSON[Qnum].options.Op1.text = obj.Answers;
    simJSON[Qnum].options.Op1.type = {};
    simJSON[Qnum].options.Op1.type.correct = {};
    simJSON[Qnum].options.Op1.type.incorrect = {};
    if (obj["Good answer"].toLowerCase() == "true" || obj["Good answer"].toLowerCase() == "t") {
      simJSON[Qnum].options.Op1.type.correct.op = "true";
      let arr = obj.Marks.split(" ");
      simJSON[Qnum].options.Op1.type.correct.mark = parseFloat(
        divBits(arr[arr.indexOf("true") + 1], Qnum)
      );
      simJSON[Qnum].options.Op1.type.incorrect.op = "false";
      simJSON[Qnum].options.Op1.type.incorrect.mark = parseFloat(
        divBits(arr[arr.indexOf("false") + 1], Qnum)
      );
    } else if (obj["Good answer"].toLowerCase() == "false" || obj["Good answer"].toLowerCase() == "f") {
      simJSON[Qnum].options.Op1.type.correct.op = "false";
      let arr = obj.Marks.split(" ");
      simJSON[Qnum].options.Op1.type.correct.mark = parseFloat(
        divBits(arr[arr.indexOf("false") + 1], Qnum)
      );
      simJSON[Qnum].options.Op1.type.incorrect.op = "true";
      simJSON[Qnum].options.Op1.type.incorrect.mark = parseFloat(
        divBits(arr[arr.indexOf("true") + 1], Qnum)
      );
    } else {
      console.error(
        "Neither True not Flase Error in Question: " + Qnum + ", Op1"
      );
    }
  } else {
    let curOp = "Op" + (Object.keys(simJSON[Qnum].options).length + 1);
    simJSON[Qnum].options[curOp] = {};
    simJSON[Qnum].options[curOp].text = obj.Answers;
    simJSON[Qnum].options[curOp].type = {};
    simJSON[Qnum].options[curOp].type.correct = {};
    simJSON[Qnum].options[curOp].type.incorrect = {};
    if (obj["Good answer"].toLowerCase() == "true" || obj["Good answer"].toLowerCase() == "t") {
      simJSON[Qnum].options[curOp].type.correct.op = "true";
      let arr = obj.Marks.split(" ");
      simJSON[Qnum].options[curOp].type.correct.mark = parseFloat(
        divBits(arr[arr.indexOf("true") + 1], Qnum)
      );
      simJSON[Qnum].options[curOp].type.incorrect.op = "false";
      simJSON[Qnum].options[curOp].type.incorrect.mark = parseFloat(
        divBits(arr[arr.indexOf("false") + 1], Qnum)
      );
    } else if (obj["Good answer"].toLowerCase() == "false" || obj["Good answer"].toLowerCase() == "f") {
      simJSON[Qnum].options[curOp].type.correct.op = "false";
      let arr = obj.Marks.split(" ");
      simJSON[Qnum].options[curOp].type.correct.mark = parseFloat(
        divBits(arr[arr.indexOf("false") + 1], Qnum)
      );
      simJSON[Qnum].options[curOp].type.incorrect.op = "true";
      simJSON[Qnum].options[curOp].type.incorrect.mark = parseFloat(
        divBits(arr[arr.indexOf("true") + 1], Qnum)
      );
    } else {
      console.error(
        "Neither True not Flase Error in Question: " + Qnum + ", " + curOp
      );
    }
  }
  return simJSON;
};

const divBits = (s, QesNum) => {
  let total = 0,
    t = s.match(/[+\-]*(\.\d+|\d+(\.\d+)?)/g) || [];
  if (t.length > 1) {
    total = Math.abs(parseFloat(t[0])) / Math.abs(parseFloat(t[1]));
  } else {
    total = Math.abs(parseFloat(t[0]));
  }
  if (isNaN(total)) {
    console.error("True or fales calc failed at question: " + QesNum);
  }
  return total.toFixed(2);
};
