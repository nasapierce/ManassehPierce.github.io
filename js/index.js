var posts = [];
var currentPost = 0;
var tab = "&nbsp&nbsp&nbsp&nbsp";

/*
"Welcome"
tab+"Welcome to my first post here!<br/>"
+"I am Manasseh Pierce, Some know me as Darkserver my Minecraft username. "
+"I make mods for MCPE (Minecraft PE). I make both ModPE mods (Javascript) and Addons (Native Mods/C++). "

"Native vs. ModPE"
tab+"You will see this argument in the mcpe forums popup a lot. "
+"I just want to clarify, I like ModPE, and I like Native Mods.<br/>"
+tab+"ModPE is basically a watered down version of Native Mods. "
+"Blocklauncher, allows us to patch mods to MCPE, the only functions Blocklauncher adds is for ModPE.<br/>"
+tab+"MCPE is coded in C++, Not Java like PC, or Javascript. Native Mods uses functions from the MCPE library to run, no it doesn't use Blocklauncher for functions, Blocklauncher just allows it to run.<br/>"
+tab+"Blocklauncher translates the ModPE Javascript into C++. Lets take a hook from ModPE... like modTick, this uses GameMode::tick from the MCPE Library to run.<br/>"
+tab+"So in the long run, ModPE is faster to code, Easier to learn, but slower in game. "
+"Native, takes a while to learn, Slower to code, more detailed, and way faster than ModPE. "
+"If you were going to pick between the two I would Say ModPE is a choice for people who want to learn how the game works before going to Native.<br/>"
+"If you have any more questions contact me on twitter <a href='twitter.com/pierce_manasseh'>@pierce_manasseh</a>"

"Learn to Mod"
tab+"To start, learn C++ if you want to make addons. No, knowing a tad bit wont help. You will have to learn it and take your time.<br/>"
+"Learn Javascript if you want to make ModPE mods, same applys here, take your time.<br/>"
+"If you know/started C++ go <a href='zhuoweizhang.net/addongen'>here</a>. this will take you to 500ise's addon generator. Type in your package name (ex. com.darkserver.addon) then the name (ex. My First Addon) then the version to run it on (0.11.0 for 0.11 or 0.12.1.b8 for build 8 ect.) "
+"Next you want to edit the mod, you may want to get rid of all the log stuff, you dont need it. "
+"In the next post I will talk about how to change the game version."

"Game Version"
tab+"To do this first we need to know what function to use. It is Common::getGameVersionString. "
+"First we see if we need to include any headers. You may if you have a header for Common if not, lets just use Symbols (Yay .-.)<br/>"
+tab+'Okay, lets do our MSHookFunction, this when put in JNI will \"overwrite\" the function. Here is the code:<br/> void* handle = dlopen("libminecraftpe.so", RTLD_LAZY);<br/>MSHookFunction(dlsym(handle, "_ZN6Common20getGameVersionStringEv"), (void*) &Common$getGameVersionString);<br/>'
+tab+'Then put this above JNI onload, and below all your includes:<br/>std::string Common$getGameVersionString(void* p){<br/>'
+'return "I made a simple addon!";<br/>'
+'}'
*/

function addPost(header, text) {
	posts.push([text,header]);
}

function showPost(){
	$("#posts").html("");
	if(posts[currentPost][1]){
		$("#posts").append("<h3 class='ui-bar ui-bar-inherit ui-shadow ui-corner-all'>"+posts[currentPost][1]+"</h3>");
	}
		$("#posts").append("<div class='ui-body ui-body-inherit ui-shadow ui-corner-all'><p>"+posts[currentPost][0]+"</p></div>");
}

function nextPost(){
	if(posts[currentPost+1]){
		currentPost++;
		showPost();
	}
}
	  
function lastPost(){
	if(posts[currentPost-1]){
		currentPost--;
		showPost();
	}
}
