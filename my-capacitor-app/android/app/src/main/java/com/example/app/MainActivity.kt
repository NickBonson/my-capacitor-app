package com.example.app

import android.os.Bundle
import com.getcapacitor.BridgeActivity
import dev.capacitor.plugins.CapacitorNativePasskeyPlugin

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        registerPlugin(CapacitorNativePasskeyPlugin::class.java)
    }
}
