import React, { useRef } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

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
                height: 100%;
                background-color: #0c0c1f;
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                overflow-x: hidden;
            }
            #ls-widget {
                width: 100% !important;
                height: 100% !important;
                border: none !important;
                background: transparent !important;
                overflow-x: hidden !important;
            }
            /* Ajustes específicos para móvil */
            @media screen and (max-width: 768px) {
                #ls-widget {
                    transform: scale(1);
                    transform-origin: top left;
                }
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
        startInLoadingState={true}
        scalesPageToFit={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        originWhitelist={['*']}
        bounces={false}
        overScrollMode="always"
        contentInsetAdjustmentBehavior="automatic"
        setSupportMultipleWindows={false}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        onLoadStart={() => console.log('Widget cargando...')}
        onLoadEnd={() => console.log('Widget cargado')}
        onError={(error) => console.log('Error en widget:', error)}
        injectedJavaScript={`
          // Ajustar el viewport para móvil
          const meta = document.createElement('meta');
          meta.name = 'viewport';
          meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
          document.getElementsByTagName('head')[0].appendChild(meta);
          
          // Prevenir zoom accidental
          document.addEventListener('gesturestart', function (e) {
            e.preventDefault();
          });
          
          true; // Requerido para que funcione el injectedJavaScript
        `}
      />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#0c0c1f',
    width: width,
  },
});