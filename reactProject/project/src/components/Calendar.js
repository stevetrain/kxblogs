import React, { PureComponent as Component} from 'react';
import ContentEditable from 'react-contenteditable'

class Calendar extends Component {
  createBody = function(x){
    if(x===undefined){return};
    let table = [];
    // Outer loop to create parent
    for (let i = 0; i < x.length; i++) {
      let children = [];
      let cols = Object.keys(x[1]);
      let cells = Object.values(x[i]);
      //Inner loop to create children
      for (let j = 0; j < cells.length ; j++) {
        let cn = "";
        let editable = true;
        if(cols[j]==="Month"){
          cn = "header-month highlight";
          editable = false;
        };
	    if(0<=["Mon","Tue","Wed","Thur","Fri","Sat","Sun"].indexOf(cols[j])){
	      if(((new Date(cells[j]))<new Date()) && (cells[j].includes("-"))){
          	cn+=" highlight";
          };
	      cells[j] = cells[j].split("-")[2];
	      cn += " header-date";
	      editable = false;
	    };
	    let html = `<td>${cells[j]}</td>`;
	    children.push(
	    <ContentEditable
	                  key={i+","+j}
                      innerRef={React.createRef()}
                      html={html}
                      disabled={!editable}
                      value={cells[j]}

                      onChange={(e) => this.props.cellChange(e, i, cols[j])}
                      onBlur={this.props.editRow}
                      tagName='td'
                      className={cn}
                    />);
      };
      //Create the parent and add the children
      table.push(<tr key={i}>{children}</tr>);
    };
    return table;
  }


 componentDidMount(){
    document.addEventListener("keydown", this.props.keyDown, false);
    document.addEventListener("wheel", this.props.wheel, false);
    this.props.tabChange();
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.props.keyDown, false);
    document.removeEventListener("wheel", this.props.wheel, false);
  }

    formatHeader = function(x){
        if(x==="Month"){
              return x;
          }else if(x.includes("Comment")){
                return x.slice(0, -7);
          };
    };

  createHead = function(x){
    if(x===undefined){return};
    let children = [];
    x=Object.keys(x[0]);
    let cn;
    //Inner loop to create children
    for (let j = 0; j < x.length; j++) {
      cn = "";
      if(x[j]==="Month"){
         cn = "header-month";
      }else if(0<=["Mon","Tue","Wed","Thur","Fri","Sat","Sun"].indexOf(x[j])){
         cn = "header-date";
      }
      children.push(<th className={cn} key={JSON.stringify(j)} >{this.formatHeader(x[j])}</th>)
    };
    //Create the parent and add the children
    return(<tr>{children}</tr>);
  }

  createTable = function(t){
    if(t===undefined){return}
    for(let i=0; i<t.length; i++){
      delete t[i].hiddenIndex;
    }
    return (
      <React.Fragment>
          <thead>
            {this.createHead(t)}
          </thead>
          <tbody>
            {this.createBody(t)}
          </tbody>
      </React.Fragment>
    )
  }

  render() {
    let res;
    if(this.props.monthMessage.length!==0){
        res=<div className="monthName">{this.props.monthMessage}</div>
    }else{
        res =(
          <div style={{'marginLeft':'1%'}}>
              <table className="calendar">
                {this.createTable(this.props.table)}
              </table>
          </div>
        )
    }
    return res;
  }
}

export default Calendar