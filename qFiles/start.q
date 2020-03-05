loader:{
 files:(key `:qFiles) except `start.q;
 bools:files like "*.q";
 scripts:files where bools;
 tabs:files where not bools;
 tabs:tabs where not "." in/:string tabs;
 errorFunc:{show enlist(.z.p; `$"Load error"; x)};
 getTabs:{x set get `$":qFiles/",string x; show enlist(.z.p; `$"Loading Table:"; x)};
 getScripts:{system"l qFiles/",string x};
 @[getTabs; ; errorFunc] each tabs; 
 show enlist(.z.p; `$"Loading Scripts"; scripts);
 @[getScripts; ; errorFunc] each scripts;
 };
loader();