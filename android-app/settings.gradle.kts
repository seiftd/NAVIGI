pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
        
        // JitPack for GitHub-based libraries
        maven { url = uri("https://jitpack.io") }
        
        // ByteDance/Pangle for some ad networks
        maven { url = uri("https://artifact.bytedance.com/repository/pangle") }
        
        // Tapjoy SDK Repository (for future use)
        maven { 
            url = uri("https://tapjoy.bintray.com/maven")
            isAllowInsecureProtocol = false
        }
        
        // Pollfish SDK Repository (for future use)  
        maven { 
            url = uri("https://pollfish.jfrog.io/artifactory/pollfish-android")
            isAllowInsecureProtocol = false
        }
        
        // JCenter for legacy dependencies (deprecated but still needed for some libraries)
        @Suppress("DEPRECATION")
        jcenter()
    }
}

rootProject.name = "NAVIGI"
include(":app")