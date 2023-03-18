interface Window {
  $loadingBar?: import('naive-ui').LoadingBarProviderInst;
  $dialog?: import('naive-ui').DialogProviderInst;
  $message?: import('naive-ui').MessageProviderInst;
  $notification?: import('naive-ui').NotificationProviderInst;
	SpeechRecognition: any;
	webkitSpeechRecognition: any;
	mozSpeechRecognition: any;
	msSpeechRecognition: any;
	oSpeechRecognition: any;
}

declare module 'web-speech-cognitive-services'
