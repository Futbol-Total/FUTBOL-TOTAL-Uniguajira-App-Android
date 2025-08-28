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
            body {
                margin: 0;
                padding: 0;
                background-color: transparent;
                font-family: Arial, sans-serif;
            }
            #ls-widget {
                width: 100% !important;
                height: 100% !important;
                border: none !important;
                overflow: hidden !important;
            }
        </style>
    </head>
    <body>
        <div id="ls-widget" data-w="awo_w6987_672fefc15b4d4"></div>
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
        startInLoadingState={true}
        scalesPageToFit={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});