import { ref, onMounted, onBeforeUnmount } from 'vue'

export default function defineCalendar(ws, qPromise) {
  console.log('Defining Calendar');
  const calendar = ref([]);
  calendar.value = [{}];
  const startDate = new Date("08/03/2015");
  const today = new Date();
  const index = ref([]);
  const height = ref([]);
  index.value = Math.round((today.getTime()-startDate.getTime())/(7*24*60*60*1000))-2;
  const scrollTimer = ref([])
  scrollTimer.value = 0;
  var monthNames = ["January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
  ];

  var getHeight =  function(obj){
    return qPromise(".cal.getHeight",obj).then(postGetHeight)
  }

  var postGetHeight = function(data){
    height.value=data;
    getCalendar(index.value);
  }

  var getCalendar = function(i){
    return qPromise(".cal.getCalendar",i).then(postGetCalendar)
  }

  var postGetCalendar = function(table){
    calendar.value=table;
    scrollTimer.value = 0;
  }

  var onWheel = function(event){
    clearTimeout(scrollTimer.value);
    let polarity = 1;
    if(event.deltaY<0){polarity=-1}
    let edge = false;
    if(index.value<=0 && polarity===-1){edge = true}
    if(index.value>=height.value && polarity===1){edge = true}
    if(!edge){index.value+=polarity}
    scrollTimer.value = setTimeout(getCalendar,50, index.value);
  }

  var onKeyDown = function(event){
    //Don't refresh the calender if the user is currently editing a cell
    if(event.target.tagName==='TD'){return}
    let code;
    if (!event){
      code = window.event.keyCode;
    }else if (event.charCode){
      code = event.charCode;
    }else{
      code = event.keyCode;
    }
    switch(code) {
      case 37:
        //left-arrow
        if(index.value<=8){index.value = 0}else{index.value -= 8}
        break;
      case 38:
        //up-arrow
        if(index.value!==0){index.value -= 1}
        break;
      case 39:
        //right-arrow
        if(index.value>(height.value-8)){index.value = height.value}else{index.value += 8}
        break;
      case 40:
        //down-arrow
        if(index.value<height.value){index.value += 1}
        break;
      default:
        //do nothing for other keys
        break;
    }
    getCalendar(index.value);
  }

  var addListeners = function(){
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("wheel", onWheel, false);
  }

  var removeListeners = function(){
    document.removeEventListener("keydown", onKeyDown, false);
    document.removeEventListener("wheel", onWheel, false);
  }

  onMounted(addListeners);
  onBeforeUnmount(removeListeners);
  return {
    calendar,
    startDate,
    index,
    scrollTimer,
    monthNames,
    getHeight,
    onWheel,
    onKeyDown,
    height
  }
}