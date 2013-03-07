//#######################################################################################################//
//########################################## ISPOT CONFIG ###############################################//
//#######################################################################################################//

var ispot = { 
	testPanel: "002-000111", DFM: true, id: "citypromoSimpler-273711", GUID: "10163fbc-1fdb-433f-8d03-0df73e612682",
	textBoxes: {	
		dynamictxt: { x: 87, y: 28, size: 65, width: 678, kern: 1, lead: 0, charperline: 30, lines: 1 }	
	},
	imageClips: {
		
	},
	share: { playSlide: "failsafe" }
}

//-------------------------------------------- LOAD DATA ------------------------------------------------//

function roundNumber(num, dec) {//Function that rounds a number to X decimal places
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function loadData(ds){
	//----Local VARS----//
	var time = new Date();	
	var hours = time.getHours();	
	var minutes = (time.getMinutes())/60;
	var timeOfDay;
	var dynamicText;
	var weatherType;
	var weatherText;
	var eventText;
	
	//--Data Location Vars--//
	var eventsObj;
	var weatherDataObj;
	var taglinesObj;
	var weathertaglineObj;
	
	//--Shared vars--//
	//**weather TODO: packace and ship to Scala as an array
	var lcloudOp = 0;//light clouds opacity int
	var snowOp = 0; 
	var accum_snowOp = 0; 
	var Dark_cloudsOp = 0;
	var LightningOp = 0;
	var RainOp = 0;
	
	//**events
	var	dinoOp = 0;
	var fireworksOp = 0; 
	
	//**city
	var skyx;//sky position
	var sun_spin; //sun/moon rotation
	var cityOvOp = 0; //city darkness overlay opacity int
	var lightsOp = 0; //city lights overlay opacity int
	
	//----MANUAL OVERIDES----//
	hours = 23
	//minutes = 24/60
	
	//----DAY NIGHT CYCLE----//
	var totaltime = hours + minutes;
	var percent = (totaltime / 24) * 100;
	
	//Set time of day for dynamic text data
	if(hours < 12 && hours >= 5){
		timeOfDay = "morning";
	}
	if(hours < 17 && hours >=12){
		timeOfDay = "noon";
	}
	if(hours >= 17 || hours < 5){
		timeOfDay = "night";
	}
	
	if(percent > 50){//sky scrolls down after noon
		ispot.share.skyx = roundNumber(((percent/100)*510*2 - 1020), 0);
			var ambiance = roundNumber((percent - 50)*5, 0);
			if(ambiance >= 100){
				ambiance = 100
			}
			cityOvOp = ambiance;
			lightsOp = ambiance;
	}
	else{//sky scrolls up before noon
		ispot.share.skyx = roundNumber((percent/100)*-510*2, 0);
		if(percent < 50){
			var ambiance = roundNumber(250 - (percent*5), 0);
			if(ambiance <= 0){
				ambiance = 0
			}
			if(ambiance >= 100){
				ambiance = 100
			}
			cityOvOp = ambiance;
			lightsOp = ambiance;
		}
	}
	
	ispot.share.sun_spin = roundNumber((percent/100)*360, 0);//Sun and moon rotate
	//TODO add building overlay and lighting to cycle
	
	
	//--Data sifting--//
	
	for (var i=0; i<ds.children.length; i++){
		
		//gets array location for other vars
		
		for(x in ds.children[i]){
			if( ds.children[i][x] == "Events"){
				eventsObj = ds.children[i];
			}
			else if( ds.children[i][x] == "ISpotWeatherDataNode"){
				weatherDataObj = ds.children[i].value.observation;
			}
			else if( ds.children[i][x] == "taglines"){
				taglinesObj = ds.children[i];
			}
		 }
	 
	}
	
	//--Manage Weather Layers--//
	switch(weatherDataObj.iconUrlName.toLowerCase()){
		case "fg.png"://ighthouse with fog
		case "sctfg.png"://lighthouse with fog
		case "br.png"://lighthouse with fog
		case "nbknfg.png"://lighthouse with fog moon
		case "nfg.png"://lighthouse with fog moon
		case "du.png"://dusty
		case "dust.png"://dusty
		case "ndu.png"://dusty
		case "smoke.png": //smoke TODO?
					foggy();
					break;
					
		case "bkn.png"://clouds
		case "hi_bkn.png":// 2 clouds
		case "bkn.png":// 2 clouds
		case "fu.png"://clouds in front of sun
		case "hi_nbkn.png"://clouds in front of moon
		case "nbkn.png"://clouds in front of moon
		case "nfu.png"://lighter clouds w/moon
		case "novc.png"://clouds w/moon
		case "ovc.png"://clouds in front of sun
		case "pcloudy.png"://clouds partly in front of sun
					cloudy();
					break;
					
		case "few.png"://barely any clouds w/sun
		case "hi_few.png"://barely any clouds w/sun
		case "hi_nfew.png"://barely any clouds w/moon
		case "nfew.png"://barely any clouds w/moon
		case "mist.png"://barely any clouds w/sun	
		case "hazy.png"://very barely any clouds w/sun 
		case "tcu.png"://very barely any clouds w/sun 
		case "hi_nskc.png"://no clouds w/moon
		case "hi_skc.png"://sun
		case "hot.png"://Hot sun
		case "nskc.png": //moon
		case "skc.png"://sun
		case "nwind.png": //moon windy TODO Windy should have its own gfx
		case "wind.png": //windy TODO Windy should have its own gfx
					clear();
					break;
					
		case "ra.png"://rain
		case "nra.png"://rain in front of moon
		case "hi_nshwrs.png"://rain in front of moon
		case "hi_shwrs.png"://rain
		case "shwrs.png"://rain
		case "hi_nsct.png": //light rain in front of moon 	
		case "hi_nsct.png": //light rain in front of sun 
		case "sct.png": //light rain in front of sun 
		case "scttsra.png": //rain in front of sun 
		case "nsct.png": //light rain in front of moon
		case "nshwrs.png": //rain w/moon
					rain();
					break;
					
		case "nshra.png"://light tstorms in front of moon
		case "shra.png"://light tstorms
		case "nscttsra.png"://tstorms in front of moon
		case "hi_ntsra.png"://tstorms in front of moon 
		case "ntsra.png"://tstorms in front of moon
		case "hi_tsra.png"://tstorms 
		case "tsra.png"://tstorms 
					thunderStorms();
					break;
		
		case "nsvrtsra"://tornado moon TODO: TOrnadoes should have thier own assets
		case "svrtsra"://tornado TODO: TOrnadoes should have thier own assets
		case "ntor"://tornado moon TODO: TOrnadoes should have thier own assets
		case "tor"://tornado moon TODO: TOrnadoes should have thier own assets
					tornado();
					break;
					
		case "hurr.png"://Hurricane TODO: This should have it's own assets
		case "hurr-noh.png"://Hurricane TODO: This should have it's own assets
		case "tropstorm.png"://Hurricane/tropical storm TODO: This should have it's own assets
		case "tropstorm-noh.png"://Hurricane/tropical storm TODO: This should have it's own assets
					hurricane();
					break
		
		case "cold.png"://thermometer w/ snowflakes 
					cold();
					break;
					
		case "ip.png"://Hail I think? 
		case "nip.png"://Hail I think? Moon
		case "nsn.png"://snow w/moon
		case "sn.png"://snow
					snow();
					break;
					
		case "blizzard.png": 
					blizzard();
					break;
					
		case "fzra.png"://rain & snow cloud
		case "nfzra.png"://rain & snow cloud moon
		case "fzrara.png"://hail & snow cloud
		case "nraip.png"://hail & rain cloud
		case "raip.png"://hail & rain cloud
		case "nrasn.png"://snow & rain cloud
		case "rasn.png"://snow & rain cloud
					freezingRain();
					break;
					
		case "nmix.png"://thunderstorms and snow moon
		case "mix.png"://thunderstorms and snow
					mix();
					break
					
		case "wave"://Tsunami?
		case "error.png"://NO report
		default: 
					//--Maybe change to clear weather if default happens too frequently--//
					throw new ISpotError("No weather image data recieved");
	}
	
	function clearAllWeather(){
		//Set all layer transparency vars to 0
		lcloudOp = 0;
		snowOp = 0; 
		accum_snowOp = 0; 
		Dark_cloudsOp = 0;
		LightningOp = 0;
		RainOp = 0;
		weatherType = "";
	}
	
	function clear(){
		clearAllWeather();
		lcloudOp = 50;
		weatherType = "clear";
	}
	function foggy(){
		clearAllWeather();
		lcloudOp = 100;
		Dark_cloudsOp = 25;
		weatherType = "foggy";
	}
	function cloudy(){
		clearAllWeather();
		lcloudOp = 70;
		Dark_cloudsOp = 70;
		weatherType = "cloudy";
	}
	function rain(){
		clearAllWeather();
		lcloudOp = 60;
		Dark_cloudsOp = 80;
		RainOp = 100;
		weatherType = "rain";
	}
	function thunderStorms(){
		clearAllWeather();
		lcloudOp = 80;
		Dark_cloudsOp = 100;
		RainOp = 100;
		LightningOp = 100;
		weatherType = "thunderStorms";
	}
	function hurricane(){
		clearAllWeather();
		Dark_cloudsOp = 100;
		RainOp = 100;
		LightningOp = 100;
		weatherType = "hurricane";
		//add gfx and vars
	}
	function tornado(){
		clearAllWeather();
		Dark_cloudsOp = 100;
		weatherType = "tornado";
		//add gfx and vars	
	}
	function snow(){
		clearAllWeather();
		lcloudOp = 50;
		Dark_cloudsOp = 70;
		snowOp = 70; 
		accum_snowOp = 100; 
		weatherType = "snow";
	}
	function blizzard(){
		clearAllWeather();
		lcloudOp = 100;
		Dark_cloudsOp = 100;
		snowOp = 100; 
		accum_snowOp = 100; 
		weatherType = "blizzard";
	}
	function cold(){//bLUE TINT?
		clearAllWeather();
		lcloudOp = 50;
		accum_snowOp = 100; 
		weatherType = "cold";
	}
	function freezingRain(){//nEEDS MORE SHEEN
		clearAllWeather();
		lcloudOp = 100;
		Dark_cloudsOp = 90;
		RainOp = 65;
		snowOp = 20;
		accum_snowOp = 50; 
		weatherType = "freezingRain";
	}
	function mix(){
		//thunderstorms and snow
		clearAllWeather();
		Dark_cloudsOp = 100;
		lcloudOp = 100;
		RainOp = 70;
		snowOp = 70;
		accum_snowOp = 25; 
		LightningOp = 100;
		weatherType = "mix";
	}

	//TODO function windy(){clearAllWeather();}
	//TODO function tsunami(){clearAllWeather();}
	//TODO add a light parameter to some conditions and modify switch statements to use it to lower opacity of some elements without writing new functions
	
	//--Test wether effects--//
		//clear();
		//foggy();
		//cloudy();
		//rain();
		//thunderStorms();
		//hurricane();
		//tornado();
		//snow();
		//blizzard();
		//cold();
		//freezingRain();
		//mix();
	
	//--Event System--//
	//TODO: figure this crap out
	
	//--Dynamic Text--//
	//I'd like to cach last text used and make sue the board isn't repeating itself
	//should also do some sort of iterator or boolean to alternate between event txt and normal text

	for (var i=0; i<taglinesObj.children.length; i++){//gets a random entry in the time of day folder
			//WSH.Echo(taglinesObj.children[i].name);
			if(taglinesObj.children[i].name == timeOfDay){
				var len = taglinesObj.children[i].children.length;				
				var dex = Math.floor(Math.random()*len);				
				dynamicText = taglinesObj.children[i].children[dex].value;
			}
			
			if(weatherType !== null && weatherType !== undefined && weatherType !== ""){//gets location of weather text
				if(taglinesObj.children[i].name == "weather"){
					weathertaglineObj = taglinesObj.children[i];
				}
			}
	}
	
	if(weathertaglineObj != undefined){	//chooses a dynamic data option to display based on weighted values
		for (var i=0; i<weathertaglineObj.children.length; i++){
			if(weathertaglineObj.children[i].name == weatherType){
				var len = weathertaglineObj.children[i].children.length;				
				var dex = Math.floor(Math.random()*len);				
				weatherText = weathertaglineObj.children[i].children[dex].value;
			}
		}
	}
	
	var decider = roundNumber(Math.random()*11,0);
	if(decider > 9 && weatherText != undefined){//weighs chance of seeing weather related item
		placeText(weatherText, "dynamictxt");
	}else if(decider > 8 ){//Weighs chance of seeing the time
		placeText("It's " + UTIL.simpleTime(true), "dynamictxt");
	}else if(decider > 1 ){
		if(dynamicText != undefined){
			placeText(dynamicText, "dynamictxt");
		}
		else throw new ISpotError("No dynamic text data");//can replace with default logo
	}else{
		if(weatherDataObj.temp != undefined){
			var temp = Math.round(weatherDataObj.temp);
			var comment;
			if(temp > 85){
				comment = ", I'm getting hot up here."
			} else if(temp > 68 ){
				comment = " and it feels nice."
			} else if(temp >55){
				comment = " I'm getting chilly"
			} else{
				comment = ", Brrr!"
			}
			placeText(temp + "\u00B0F" + comment, "dynamictxt");
		}
		else throw new ISpotError("No weather temp data");//can replace with default logo
	}

	
	//---TODO Failsafe Logic--//
	
	//Failsafe on these handled by switch statement
	//Replace by changing all weather vars to a weather object and assign with a script simmilar to this
	//	if (UTIL.detectScala()){
	//		var i = 0
	//		for (x in weather){
	//			weatherArray.item(i+1).value = weather.x;
	//		}
	//	}
	ispot.share.lightsOp = lightsOp;
	ispot.share.cityOvOp = cityOvOp;		
	ispot.share.lcloudOp = lcloudOp;	
	ispot.share.snowOp = snowOp; 
	ispot.share.accum_snowOp = accum_snowOp; 
	ispot.share.Dark_cloudsOp = Dark_cloudsOp;
	ispot.share.dinoOp = dinoOp;
	ispot.share.fireworksOp = fireworksOp; 
	ispot.share.LightningOp = LightningOp;
	ispot.share.RainOp = RainOp;
	
	ispot.share.playSlide = "slide1";
}

function failsafe(e){
	ispot.share.debug = e;
	ispot.share.playSlide = "failsafe";
}

//#######################################################################################################//
//################################### DO NOT EDIT BEYOND THIS POINT #####################################//
//#######################################################################################################//

eval(importFile("C:\\Lamar\\DigitalDisplays\\iSpots\\ScriptLibrary\\Lamar.DigitalDisplays.Web.Data.Client-1.1.77787.js"));
if (UTIL.detectScala() && !SiteID.value) SiteID.value = ispot.testPanel;
else if (!UTIL.detectScala()) SiteID = { value: ispot.testPanel };

//=##= TEMPORARY v77791 PATCHES ======================================================================##=//
UTIL.countdown = function(futureString, returnVals){
	var ordered = ["Years", "Months", "Weeks", "days", "hours", "minutes", "seconds"];
	var timeLeft = { over: true }, inits = {};
	var futureTime = new Date(futureString);
	var remainder = Math.floor(Date.parse(futureTime) - Date.parse(new Date()));
	if (remainder > 0){
		for (var i = 0; i<ordered.length; i++){
			var index = ordered[i];
			var regex = new RegExp(index.slice(0,1));
			if (regex.test(returnVals)){
				timeLeft[index] = Math.floor(remainder / TIME_VALUES[index]);
				if (returnVals.length == 1) timeLeft[index] += 1;
				if (timeLeft[index] != 0) timeLeft.over = false;
				remainder -= timeLeft[index] * TIME_VALUES[index];
			}
		} 
	} 
	return timeLeft;
};	
UTIL.countup = function(futureString, returnVals){
	var ordered = ["Years", "Months", "Weeks", "days", "hours", "minutes", "seconds"];
	var timeLeft = { started: false }, inits = {};
	var futureTime = new Date(futureString);
	var remainder = Math.floor(Date.parse(new Date()) - Date.parse(futureTime));
	if (remainder > 0){
		for (var i = 0; i<ordered.length; i++){
			var index = ordered[i];
			var regex = new RegExp(index.slice(0,1));
			if (regex.test(returnVals)){
				timeLeft[index] = Math.floor(remainder / TIME_VALUES[index]);
				if (returnVals.length == 1) timeLeft[index] += 1;				
				if (timeLeft[index] != 0) timeLeft.started = true;
				remainder -= timeLeft[index] * TIME_VALUES[index];
			}
		} 
	}
	return timeLeft;
};	 
LDD.placement.placeText.prototype.rescaleText = function(){
	var yOffset = 0;
	var originalSize = this.textBox.size;
	var originalLead = this.textBox.lead;
	if (this.scaleToFit && this.textBox.charperline < 42){
		var lengthDiff = this.textBox.charperline - this.text.length;
		if (lengthDiff > 0) this.textBox.size += lengthDiff * (1 + (15 / this.textBox.charperline));
		if (this.textBox.size > (originalSize * 2)) this.textBox.size = originalSize * 2;
	}
	for (y=-10; y>originalLead; y--) yOffset++;
	var oldBoxHeight = (originalSize * this.textBox.lines) + (10 + (originalLead * (this.textBox.lines - 1)));
	var newBoxHeight = (this.textBox.size * UTIL.getLineCount(this.textBox.copy)) + (10 + (originalLead * (UTIL.getLineCount(this.textBox.copy) - 1)));
	this.textBox.y += Math.floor((oldBoxHeight - newBoxHeight) * this.valign) + yOffset;	
}

//=##= MAIN ==========================================================================================##=//

try {
	if (ispot.DFM){
		ispot.store = new LDD.DataStore();
		var dataSource = ispot.store.getData({ dataSource: ispot.GUID, 
			display: SiteID.value, cacheOnly: true }); // optional: format, getWebcam, expiration (hours)
		loadData(dataSource);
	} 
	else loadData();
} 
catch (err){
	ispot.error = new LDD.ErrorHandler(err);
	failsafe(err.description);
}
finally {
	new LDD.AutoScale(ispot);
	var Log = new LDD.Log(ispot);
		Log.update();
	if (!UTIL.detectScala()){
		WSH.Echo("   --------------\n /* DEBUG */\n---------------\n\nSharedValues:  " + $(Log.data.SharedValues));
	}
	else dwellTime.value -= (new Date() - START_TIME);
}

//=##= UTILITY FUNCTIONS =============================================================================##=//

function placeText(txt, index){
	if (ispot.textBoxes[index]){
		var options = [];
		for (var r=2; r<arguments.length; r++) options.push(arguments[r]);
		ispot.textBoxes[index] = new LDD.placement.placeText(txt, ispot.textBoxes[index], options);
	}
	else throw new ISpotError("PlaceText Error: Tried to place text with the invalid index of '" + index + "'", 901);
}
function placeImage(img, index){
	if (ispot.imageClips[index]){
		var options = [];
		for (var r=2; r<arguments.length; r++) options.push(arguments[r]);
		ispot.imageClips[index] = new LDD.placement.placeImage(img, ispot.imageClips[index], options);
	}
	else throw new ISpotError("PlaceImage Error: Tried to place image with the invalid index of '" + index + "'", 902);
}
function importFile(pathToFile){
	var fso = new ActiveXObject("Scripting.FilesystemObject");
	var Library = fso.OpenTextFile(pathToFile, 1, false);
	var FileContents =  Library.ReadAll();
	Library.Close();
	return FileContents;
}
