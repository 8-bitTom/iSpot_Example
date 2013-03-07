//#######################################################################################################//
//########################################## ISPOT CONFIG ###############################################//
//#######################################################################################################//

var ispot = { 
	testPanel: "002-000111", id: "citypromoSimpler-273711", GUID: "10163fbc-1fdb-433f-8d03-0df73e612682"
}

//--------------------------------------------- CONFIG --------------------------------------------------//

eval(importFile("C:\\Lamar\\DigitalDisplays\\iSpots\\ScriptLibrary\\Lamar.DigitalDisplays.Web.Data.Client-1.1.77787.js"));
if (UTIL.detectScala() && !SiteID.value) SiteID.value = ispot.testPanel;
else if (!UTIL.detectScala()) SiteID = { value: ispot.testPanel };

try {
	var store = new LDD.DataStore();
	var dataSource = store.getData({ "dataSource": ispot.GUID, "display": SiteID.value, "getWebcam" : false });
	var nodes = dataSource.findByType("ISpotMediaLibraryDataNode");
	for (var i=0; i<nodes.length; i++){
		nodes[i].cacheAllSpots();
	}
}
catch(err){
	if (UTIL.detectScala()){
		ispot.error = new LDD.ErrorHandler(err);
		var Log = new LDD.Log(ispot);
			Log.update();
		ErrMessage.value = ispot.error.message;
	}
	else WSH.Echo(err.message);		
}
	
//#######################################################################################################//
//#######################################################################################################//
//#######################################################################################################//

function importFile(pathToFile){
	var fso = new ActiveXObject("Scripting.FilesystemObject");
	var Library = fso.OpenTextFile(pathToFile, 1, false);
	var FileContents =  Library.ReadAll();
	Library.Close();
	return FileContents;
}
