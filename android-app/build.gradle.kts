// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "8.2.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.20" apply false
    id("com.google.gms.google-services") version "4.4.0" apply false
    id("com.google.firebase.crashlytics") version "2.9.9" apply false
    id("com.google.dagger.hilt.android") version "2.48" apply false
    id("org.jetbrains.kotlin.plugin.serialization") version "1.9.20" apply false
}

buildscript {
    dependencies {
        classpath("com.google.dagger:hilt-android-gradle-plugin:2.48")
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
        
        // Tapjoy SDK Repository
        maven {
            url = uri("https://tapjoy.bintray.com/maven")
            isAllowInsecureProtocol = false
        }
        
        // Pollfish SDK Repository  
        maven {
            url = uri("https://pollfish.jfrog.io/artifactory/pollfish-android")
            isAllowInsecureProtocol = false
        }
        
        // JitPack for additional libraries
        maven { url = uri("https://jitpack.io") }
        
        // JCenter (for legacy dependencies)
        @Suppress("DEPRECATION")
        jcenter()
    }
}

task("clean", Delete::class) {
    delete(rootProject.buildDir)
}