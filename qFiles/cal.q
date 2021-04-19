//Don't let the user go more than two years into the future
.cal.getHeight:{
 exec count i from cal where (Mon.year)<(2+`year$.z.d)
 };

//eg .cal.getCalendar[150f]
.cal.getCalendar:{[index]
 t:update hiddenIndex:i from cal;
 select ["j"$index,8] from t
 };

//eg .cal.editRow[271f; "WedComment"; "Provided text"]
.cal.editRow:{[index; kolName; kolVal]
 index:"j"$index;
 kolName:`$kolName;
 kolType:type cal[kolName];
 //Only include numbers in number fields
 if[kolType in "h"$5+til 5; kolVal@:where kolVal in .Q.n,"-."];
 //Cast to the appropriate datatype
 kolVal:(neg kolType)$kolVal;
 if[kolType=0h; kolVal:(enlist; kolVal)];
 if[kolType=11h; kolVal:enlist kolVal];
 //update kolName:kolVal from cal where i=index
 ![`cal; enlist(=;`i;index); 0b; (enlist kolName)!enlist kolVal];
 saveFiles[]
 };

createCal:{
 weekDays::`Mon`Tue`Wed`Thur`Fri`Sat`Sun;
 offSet:1 - .z.d mod 7;
 //Get all dates until my death on 11th July 2100, at the ripe age of 107.
 cal::-1_7 cut 2015.08.03 +til 85*365;
 //Convert to a table
 cal::{[x] weekDays!x}each cal;
 calCount:count cal;
 kols:`$raze each string (cols cal),\:`Comment;
 //Add comment columns
 cal::![cal; (); 0b; kols!7#enlist(#;`calCount;(enlist;""))];
 cal::(raze weekDays,'kols) xcols cal;
 cal::`Month xcols update Month:`month$min each flip cal[weekDays] from cal;
 mDict:("01";"02";"03";"04";"05";"06";"07";"08";"09";"10";"11";"12")!`Jan`Feb`Mar`Apr`May`Jun`Jul`Aug`Sep`Oct`Nov`Dec;
 cal::update mDict[-2#/:string Month] from cal;
 cal::update Month:{[x;y] (string x),"-",y}'[Month;2_/:string `year$Mon] from cal;
 };

//createCal only needs run if a fresh calendar is needed
createCal();