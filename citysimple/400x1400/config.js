//#######################################################################################################//
//########################################## ISPOT CONFIG ###############################################//
//#######################################################################################################//

var scalaPlayer, scalaRuntime, config = {
	signPixelHeight: 228,
	signPixelWidth: 798,
	dwellTime: 8000,
	ISpotSpotGuid: "Local-Test-citypromoSimpler-273711",
	ISpotSlotGuid: "Local-Test-citypromoSimpler-273711",
	ISpotCustomerGuid: "Local-Test-citypromoSimpler-273711",
	ISpotDisplayGuid: "Local-Test-citypromoSimpler-273711"
}

//-------------------------------------------------------------------------------------------------------//

try {
	scalaPlayer = new ActiveXObject("ScalaPlayer.ScalaPlayer.1");
	scalaRuntime = (typeof WSH == 'undefined' && 
		typeof scalaPlayer.ScriptDir == "string") ? true : false;
} catch(e){ scalaRuntime = false; }
for (var shared in config)
	if (scalaRuntime && !this[shared].value) 
		this[shared].value = config[shared];

//#######################################################################################################//
//#######################################################################################################//
//#######################################################################################################//
