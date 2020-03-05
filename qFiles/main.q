system"c 20 170";
formatWS:{[x;trap]
 x:.j.k x;
 fname:x`func;
 x:prepSproc[x];
 id:x[0];
 func:x[1];
 arg:x[2];
 if[not trap; :.[func; arg]];
 res:.[func; arg; {`$"'",x}];
 neg[.z.w].j.j (id;fname;res)
 };

prepSproc:{[x]
 id:x`id;
 func: x`func;
 x:x`obj;
 show enlist (.z.p; `$func; x);
 func:value func;
 //If the function is monadic, enlist the argument
 if[1=count value[func][1]; x:enlist x];
 (id; func; x)
 };

.z.ws:{
 .dev.ws:x; 
 show formatWS[x; 1b]
 };
 
debug:{
 formatWS[.dev.ws; 0b]
 };

saveFiles:{
 files:(key `:qFiles) except `start.q;
 bools:files like "*.q";
 tabs:files where not bools;
 saveTabs:{(` sv `:qFiles,x) set get x; show enlist(.z.p; `$"Saved table:"; x)};
 @[saveTabs; ; {show enlist(.z.p; `$"Save error"; x)}] each tabs;
 };

.z.exit:saveFiles;