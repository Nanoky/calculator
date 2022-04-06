import React from 'react';
import './App.css';

const ButtonType = {
  operator : 1,
  operand : 2,
  state : 3
};

const labelEqual = "=";
const labelAdd = "+";
const labelMinus = "-";
const labelProduct = "x";
const labelDivide = "/";
const labelPercentage = "mod";

const labelAC = "AC";

const buttons = [
  {
    label: labelAC,
    type:ButtonType.state
  },
  {
    label: 'Hist',
    type:ButtonType.state
  },
  {
    label: labelPercentage,
    type:ButtonType.operator
  },
  {
    label: labelDivide,
    type:ButtonType.operator
  },
  {
    label: '7',
    type:ButtonType.operand
  },
  {
    label: '8',
    type:ButtonType.operand
  },
  {
    label: '9',
    type:ButtonType.operand
  },
  {
    label: labelProduct,
    type:ButtonType.operator
  },
  {
    label: '4',
    type:ButtonType.operand
  },
  {
    label: '5',
    type:ButtonType.operand
  },
  {
    label: '6',
    type:ButtonType.operand
  },
  {
    label: labelMinus,
    type:ButtonType.operator
  },
  {
    label: '1',
    type:ButtonType.operand
  },
  {
    label: '2',
    type:ButtonType.operand
  },
  {
    label: '3',
    type:ButtonType.operand
  },
  {
    label: labelAdd,
    type:ButtonType.operator
  },
  {
    label: '0',
    type:ButtonType.operand
  },
  {
    label: '.',
    type:ButtonType.operand
  },
  {
    label: 'ANS',
    type:ButtonType.state
  },
  {
    label: labelEqual,
    type:ButtonType.operator
  },
]

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ansHist : [0],
      numberStack : [],
      opStack : [],
      number : null,
      displayResult : false
    }
  }

  chooseOpIndex(operators) {
    let top = 0;
    
    for (let index = 0; index < operators.length; index++) {
      const element = operators[index];
      top = index;
      if (element in [labelDivide, labelProduct])
        break;
    }
    return top;
  }

  singleOperation(operand1, operand2, operator) {
    let result
    switch (operator) {
      case labelAdd:
        result = operand1 + operand2;
        break;

      case labelMinus:
        result = operand1 - operand2;
        break;

      case labelProduct:
        result = operand1 * operand2;
        break;

      case labelDivide:
        result = operand1 / operand2;
        break;

      case labelPercentage:
        result = operand1 % operand2;
        break;
    
      default:
        break;
    }
    return result;
  }

  removeFromStack(index, stack) {
    let newStack = stack.slice();

    newStack.splice(index, 1);

    return newStack;
  }

  addToStack(value, stack) {
    let newStack = stack.slice();

    newStack.push(value);

    return newStack;
  }

  operate(operands, operators) {
    let opIndex = this.chooseOpIndex(operators);
    let operand1 = operands[opIndex];
    let operand2 = operands[opIndex + 1];

    let result = this.singleOperation(operand1, operand2, operators[opIndex]);

    let newNStack = this.removeFromStack(opIndex + 1, operands);
    newNStack[opIndex] = result;
    let newOStack = this.removeFromStack(opIndex, operators);
    return {
      newNStack,
      newOStack
    };
  }

  calculate(operands, operators) {
    while (operators.length > 0) { 
      let {newNStack, newOStack} = this.operate(operands, operators);
      operands = newNStack;
      operators = newOStack;
    }

    let ans = operands.at(0);
    let hist = this.state.ansHist.slice();
    hist.push(ans);

    this.setState({
      ansHist : hist
    });
  }

  handleClick(button) {

    if (this.state.displayResult && button.label !== labelEqual) {
      this.setState({
        displayResult : false
      });
    }

    switch (button.type) {
      case ButtonType.operand:
        let number = (this.state.number) ? this.state.number + button.label : button.label
        this.setState({
          number : number
        });
        break;
      
      case ButtonType.operator:
        let operands = this.addToStack(
          (this.state.number) ? 
            parseFloat(this.state.number) : 
            this.state.ansHist.at(this.state.ansHist.length - 1), 
          this.state.numberStack);

        this.setState({
          numberStack : operands,
          number : null
        });

        if (button.label !== labelEqual) {
          let operators = this.addToStack(button.label, this.state.opStack);
          this.setState({
            opStack : operators
          });
        } else {
          this.calculate(operands, this.state.opStack);
          this.setState({
            displayResult : true,
            numberStack : [],
            opStack : []
          });
        }

        break;
    
      case ButtonType.state:
        switch (button.label) {
          case labelAC:
            this.setState({
              numberStack : [],
              opStack : [],
              number : null,
              displayResult : false
            })
            break;
        
          default:
            break;
        }
        break;

      default:
        break;
    }
  }

  display() {
    if (this.state.displayResult)
      return this.state.ansHist.at(this.state.ansHist.length - 1);
    
    let result = (this.state.numberStack.length > 0 || this.state.number) ? "" : "0";
    this.state.numberStack.forEach((value, index) => {
      result = result + value;
      if (this.state.opStack.length > index)
      {
        result = result + this.state.opStack[index];
      }
    });

    if (this.state.number)
      result = result + this.state.number;

    return result;
  }

  render() {
    return (
      <div className="container p-3">
        <div className='row justify-content-center'>
          <div className='card col-6 align-self-center'>
            <div className='card-body'>
              <div className='row'>
                <Screen display={this.display()} />
              </div>
              <div className='row'>
                <Table buttons={buttons} onClick={(button) => {this.handleClick(button)}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Screen = ({display}) => (
  <div className='card'>
    <div className='row justify-content-end mx-1'>
      {display}
    </div>
  </div>
);

const Table = ({buttons, onClick}) => (
  <div className='row row-cols-4 g-2'>
    {
      buttons.map((value) => (
        <div className='col'>
          <Button value={value} onClick={() => {onClick(value)}} />
        </div>
      ))
    }
  </div>
);

const Button = ({value, ...events}) => (
  <div className='d-grid'>
    <button {...events} className="btn btn-secondary">
      {value.label}
    </button>
  </div>
);

export default App;
