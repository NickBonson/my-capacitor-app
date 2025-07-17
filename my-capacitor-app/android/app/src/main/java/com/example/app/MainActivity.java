package com.example.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import dev.capacitor.plugins.CapacitorNativePasskeyPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(CapacitorNativePasskeyPlugin.class);
    }
}
