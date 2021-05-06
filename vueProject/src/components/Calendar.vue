<template>
<div>
  <div v-if="this.showSnack" class="snackbar">{{this.formatDate(index,startDate)}}</div>
  <table v-else class="table">
    <thead>
      <tr>
        <th v-for="(column,i) in calendarKeys" v-bind:class="this.headerWidth(column)" :key="i">{{formatHeader(column)}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row,index) in calendar" :key="index">
        <td v-bind:contenteditable="isEditable(colName)" v-bind:class="this.highlightDate(calendar[index][colName], colName)" v-on:blur="editRow(index, colName, $event)"
           v-for="(colName) in calendarKeys" :key="colName">{{this.formatCell(calendar[index],colName)}}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
export default {
  name: 'Calendar',
  props: {
    calendar: Array,
    qPromise: Function,
    ws: Object,
    index: Number,
    startDate: Date,
    monthNames: Array,
    scrollTimer: Number
  },
  computed: {
    showSnack: function(){return this.scrollTimer!==0},
    calendarKeys: function(){let res = Object.keys(this.calendar[0]); res.pop(); return res}
  },
  methods: {
    editRow: function(index, colName, event){
      let text = event.target.innerText;
      index+=this.index;
      this.qPromise(".cal.editRow",[index, colName, text]).then(this.postEditRow).catch(this.error)
    },
    isEditable: function(colName){
      return colName.includes('Comment')
    },
    formatDate: function(i,d){
      if(d===undefined){
        d = new Date();
      }else{
        d = new Date(d);
      }
      d.setDate(d.getDate()+(i*7));
      let month = d.getMonth();
      let year = d.getFullYear();
      return this.monthNames[month] + ' ' + year;
    },
    formatHeader: function(x){
      if(x=="Month"){
        return x;
      }else if(x.includes("Comment")){
        return x.slice(0, -7);
      }else{
        return "";
      }
    },
    formatCell: function(row, colName){
      let cell = row[colName];
      if(0<=["Mon","Tue","Wed","Thur","Fri","Sat","Sun"].indexOf(colName)){
        return cell.split("-").pop();
      }else{
        return cell.replace("&nbsp;","");
      }
    },
    highlightDate: function(dt, col){
      if(typeof(dt)!=='string'){return ''}
      if(col==='Month'){return 'highlight header-month'}
      let pastDate = (((new Date(dt))<new Date()) && (dt.includes("-")));
      if(pastDate){return 'highlight'}
      return ''
    },
    headerWidth: function(colName){
      if(colName=="Month"){
        return "header-month"
      }
      if(0<=["Mon","Tue","Wed","Thur","Fri","Sat","Sun"].indexOf(colName)){
        return "header-date"
      }
    }
  }
}
</script>

<style scoped>
.snackbar {
    position: fixed;
    z-index: 1;
    left: 40%;
    bottom: 52%;
    font-size: 55px;
    text-align:center;
}

.nightMode .highlight {color:yellow}
.dayMode .highlight {color:#005499}
.highlight {font-weight:700}
.header-month {width:57px}
.header-date {width:26px}

.table {
    width: 100%;
    max-width: 100%;
    text-align:center;
    table-layout: fixed;
}

.table>tbody>tr>td,.table>tfoot>tr>td,.table>thead>tr>td {
    line-height: 1.42857143;
    vertical-align: top;
    border-top: 1px solid #ddd;
    word-wrap:break-word;
    height: 60px
}

.table>tbody+tbody {border-top: 2px solid #ddd}
thead {display: table-header-group}
</style>
