 !macro customHeader
   !system "echo '' > ${BUILD_RESOURCES_DIR}/customHeader"
 !macroend

 !macro preInit
   ; This macro is inserted at the beginning of the NSIS .OnInit callback
   !system "echo '' > ${BUILD_RESOURCES_DIR}/preInit"
 !macroend

 !macro customInit
   !system "echo '' > ${BUILD_RESOURCES_DIR}/customInit"
 !macroend

 !macro customInstall
   !system "echo '' > ${BUILD_RESOURCES_DIR}/customInstall"
 !macroend