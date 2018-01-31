export interface SettingsProvider {
    write(key:string, value:any):void;
    read<T>(key:string):any;
}