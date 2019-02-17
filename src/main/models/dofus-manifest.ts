export interface DofusManifest {
  files: Files;
  load:  Array<any>;
}

export interface Files {
  'build/styles-native.css': VersionBuild;
  'build/script.js':         VersionBuild;
}

export interface VersionBuild {
  filename: string;
  version:  string;
}
