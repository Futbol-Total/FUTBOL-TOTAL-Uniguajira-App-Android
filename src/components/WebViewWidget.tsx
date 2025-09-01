import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewWidget() {
  const webViewRef = useRef<WebView>(null);
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            html, body {
                width: 100%;
                height: 100vh;
                background-color: #0c0c1f;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            #ls-widget {
                width: 100% !important;
                height: 100vh !important;
                border: none !important;
                background: transparent !important;
            }
        </style>
    </head>
    <body>
        <div id="ls-widget" data-w="awo_w6987_672fefc15b4d4" class="livescore-widget"></div>
        <script type="text/javascript" src="https://ls.soccersapi.com/widget/res/awo_w6987_672fefc15b4d4/widget.js"></script>
    </body>
    </html>
  `;

  return (
    <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        originWhitelist={['*']}
        bounces={false}
        overScrollMode="never"
        contentInsetAdjustmentBehavior="automatic"
        setSupportMultipleWindows={false}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        onLoadStart={() => console.log('Widget cargando...')}
        onLoadEnd={() => console.log('Widget cargado')}
        onError={(error) => console.log('Error en widget:', error)}
      />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#0c0c1f',
  },
});