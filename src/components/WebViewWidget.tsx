import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

export default function WebViewWidget() {
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
                overflow: hidden;
                background-color: transparent;
                font-family: Arial, sans-serif;
            }
            #ls-widget {
                width: 100% !important;
                height: 100vh !important;
                min-height: 100vh !important;
                max-width: 100% !important;
                border: none !important;
                overflow: visible !important;
                background: transparent !important;
                position: relative;
                z-index: 1;
            }
            #ls-widget * {
                pointer-events: auto !important;
                touch-action: auto !important;
            }
            /* Eliminar cualquier overlay que pueda interferir */
            #ls-widget::before,
            #ls-widget::after {
                display: none !important;
            }
            /* Asegurar que el contenido del widget sea completamente interactivo */
            .livescore-widget {
                width: 100% !important;
                max-width: 100% !important;
                overflow: visible !important;
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
    <View style={styles.container}>
      <WebView
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        originWhitelist={['*']}
        allowsFullscreenVideo={true}
        allowsProtectedMedia={true}
        bounces={false}
        overScrollMode="never"
        contentInsetAdjustmentBehavior="never"
        setSupportMultipleWindows={false}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
  },
});