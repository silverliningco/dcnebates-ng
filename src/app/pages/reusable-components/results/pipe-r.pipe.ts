import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeR'
})
export class PipeRPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch  (value){
      case 'indoorUnitConfiguration':
        value = 'Indoor unit configuration'
        break;
      case 'coilType':
        value = 'Coil type'
        break;
      case 'coilCasing':
        value = 'Coil casing'
        break;
      case 'coastal':
        value = 'Coastal'
        break;
      case 'electricalPhase':
        value = 'Electrical phase'
        break;
      case 'indoorUnit':
        value = 'Indoor unit'
        break;
      case 'furnace':
        value = 'Furnace'
        break;
      case 'furnaceConfiguration':
        value = 'Furnace configuration'
        break;

    }
    return value;
  }

}
 