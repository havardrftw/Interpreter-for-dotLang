class BoolOp {

    constructor (op) {
        this.op = op
    }
 
    interpret() {
        return this.op
    }
}
 
class South {

    constructor(exp) {

        this.expression = exp
    }

    interpret(r){

        r.y = r.y - this.expression.interpret(r)

       // if (!r.checkPosition()) new End().interpret(r)
    }
}

class Add {

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    interpret(r){

        return this.x.interpret(r) + this.y.interpret(r)
    }
}

class Num {

    constructor(num) {
        this.num = num

    }
    interpret(){

        return this.num
    }
}

class North {

    constructor(exp) {

        this.expression = exp
    }

    interpret(r) {

        r.y = r.y + this.expression.interpret(r)

        //if (!r.checkPosition()) new End().interpret(r)
    }
}

class Mult {

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    interpret(r){

        return this.x.interpret(r) * this.y.interpret(r)
    }
}

class Sub {

    constructor(x, y){
        this.x = x
        this.y = y
    }

    interpret(r) {

        return this.x.interpret(r) - this.y.interpret(r)
    }
}

class Id {

    constructor(name) {

        this.name = name
    }

    interpret(){

        return this.name
    }
}

class Grid {

    constructor (x, y) {
        this.x = x
        this.y = y
    }

    check(x, y) {
        return  x <= this.x && y <= this.y && x >= 0 && y >= 0
    }
}

class East {

    constructor(exp) {

        this.expression = exp
    }

    interpret(r) {

        r.x = r.x + this.expression.interpret(r)
       // if (!r.checkPosition()) new End().interpret(r)
    }
}

class Declaration {

    constructor(name, assign) {

        this.name = name
        this.assign  = assign
    }

    interpret(r) {
        r.variables[this.name.interpret(r)] = this.assign.interpret()
    }
}


class Program {

	constructor (grid, robot) {
		this.grid = grid;
		this.robot = robot;
    }

    interpret() {
		this.robot.interpret();
    }

}

class Robot {

    constructor(grid) {
        this.grid = grid;
        this.x = 0
        this.y = 0
        this.statements = []
        this.variables = {}
    }

    interpret() {
        for (let x of this.statements) {
            x.interpret(this)     
        }
    }

    addStatement(statement) {
        this.statements.push(statement)
    }

    checkPosition() {
        return this.grid.check(this.x, this.y)
    }
}

class BoolExp {

    constructor(op, x, y) {
 
         this.x = x
         this.y = y
         this.op = op
 
    }
 
     interpret(r) {
 
         if (this.op.interpret() === '>'){
 
             let x = this.x.interpret(r)
 
             let y = this.y.interpret(r)
 
             return x > y
         }
 
         else if (this.op.interpret() === '<') {
             let x = this.x.interpret(r)
 
             let y = this.y.interpret(r)
 
             return x < y
         }
 
         else if (this.op.interpret() === '==') {
             let x = this.x.interpret(r)
 
             let y = this.y.interpret(r)
 
             return x == y
         }
     }
 }

class Assignment {

    constructor(name, assign) {

        this.name = name
        this.assign = assign
    }

    interpret(r) {
        r.variables[this.name.interpret(r)] = this.assign.interpret(r)
    }
}

class West {

    constructor(exp) {

        this.expression = exp
    }

    interpret(r) {

        r.x = r.x - this.expression.interpret(r)

       // if (!r.checkPosition()) new End().interpret(r)
    }
}

class ALA {

    constructor(cond, statements) {
        this.condition = cond
        this.statements = statements
    }

    interpret(r) {

        while (this.condition.interpret(r)) {

            for (let x of this.statements) x.interpret(r)
        }
    }
}

class Variable {

    constructor(name) {
        this.name = name
    }

    interpret(r) {

        return r.variables[this.name.interpret(r)]
    }

}

class End {

    interpret(r){
        if (r.checkPosition()){
            console.log("End position:" + r.x + " " + r.y)
            document.querySelector("#eval").innerHTML = "End position:" + r.x + " " + r.y;
            //setup()
            document.querySelector("#grid").innerHTML = "";
            for (let i=1; i<=15; i++) {
                let row = document.querySelector("#grid").insertRow()
                for (let y=1; y<=15; y++) {
                    let cell = row.insertCell(-1);
                    if (y === 1) cell.innerHTML = 16-i;
                       if (i === 15) cell.innerHTML = y;
                    if (r.x === y && r.y === 16-i) {
                       cell.innerHTML= " O "
                       cell.style.backgroundColor= "red"
                       //cell.style.width= "1%"
                       
                    } 
                }
            }
            
                   
        } else {
            document.querySelector("#eval").innerHTML = "The bounds of the grid has been overstepped!" + r.x + " " + r.y
            //location.reload();
        }     
    }
}

class Begin {

    constructor(x, y){
        this.x = x
        this.y = y
    }

    interpret(r) {

        r.x = this.x.interpret(r)
        r.y = this.y.interpret(r)
    }
}

function addStatements() {
    let newStatement = document.querySelector("#mainRepl").value;

    let list = newStatement.split("\n");

    for (let x of list) {
        addStatement(x)
    }
}

function addStatement(newStatement) {

    let list = newStatement.split(" ");
    let appStat = []

    let approvedStatements = ["Begin", "Num", "West", "East", "North", "South", "End", "Variable", "ALA", "Assignment", "Declaration", "Id", "Add", "Sub", "Mult", "BoolOp", "BoolExp"];

    let approvedSyntax = ["of", ".", "'>'", "'<'", "'=='", "and", "[", "]"]

    let approvedVariables = ["'x'", "'y'", "'i'", "'k'", "'j'"]

    for (let x of list) {
        console.log(x)
        console.log(Number.isInteger(parseInt(x)))
        if (!approvedStatements.includes(x) && !approvedSyntax.includes(x) && !approvedVariables.includes(x) && !Number.isInteger(parseInt(x))) {
            alert("Statement not approved for evaluation!")
            return;

        } else if (!approvedSyntax.includes(x) && !Number.isInteger(parseInt(x)) && !approvedVariables.includes(x)){
      
            appStat.push("new " + x)
            console.log(list);
        }
        
        else {

            if (x === "of") {
                appStat.push("(")
            } else if (x === ".") {
                appStat.push(")")

            } else if (x === "and") {
                appStat.push(",")
            
            } else {
                appStat.push(x)
                console.log(list);
            }
           
        }
    }
    let app = appStat.join(" ")
    console.log(app)
    robot.addStatement(eval(app))
  
}

grid = new Grid(15,15)
robot = new Robot(grid)
program = new Program(grid, robot)

function testProgramOne() {
    
    document.querySelector("#mainRepl").value = "Declaration of Id of 'i' . and Num of 1 . .\nDeclaration of Id of 'j' . and Num of 8 . .\nBegin of Num of 23 . and Num of 6 . .\nNorth of Mult of Num of 3 . and Variable of Id of 'i' . . . .\nEast of Num of 15 . .\nSouth of Num of 4 . .\nWest of Add of Add of Mult of Num of 2 . and Variable of Id of 'i' . . . and Mult of Num of 3 . and Variable of Id of 'j' . . . . and Num of 5 . . .\nEnd of ."
        
}

function testProgramTwo() {
    document.querySelector("#mainRepl").value = "Declaration of Id of 'i' . and Num of 5 . .\nDeclaration of Id of 'j' . and Num of 3 . .\nBegin of Num of 23 . and Num of 6 . .\nNorth of Mult of Num of 3 . and Variable of Id of 'i' . . . .\nWest of Num of 15 . .\nEast of Num of 4 . .\nALA of BoolExp of BoolOp of '>' . and Variable of Id of 'j' . . and Num of 0 . . and [ South of Variable of Id of 'j' . . . and Assignment of Id of 'j' . and Sub of Variable of Id of 'j' . . and Num of 1 . . . ] .\nEnd of ."
}
