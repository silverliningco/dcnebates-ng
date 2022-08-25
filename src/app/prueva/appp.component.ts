import { Component, OnInit } from '@angular/core';
// import { BestDetail } from './model/detailBestOption';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {

  results:Array<any> = [];

  raw:Array<any> = [
    [
        {
            "EER": 13.00,
            "AFUE": 95.0,
            "HSPF": null,
            "SEER": 16.00,
            "Hcap17": null,
            "Hcap47": null,
            "fuelTypes": [
                "Natural Gas",
                "Propane Gas"
            ],
            "components": [
                {
                    "id": "24ACB724A003",
                    "SKU": "24ACB724A003",
                    "name": "Performance 17S 2-STG AC",
                    "type": "outdoorUnit"
                },
                {
                    "id": "CAPMP3617ALA",
                    "SKU": "CAPMP3617ALA",
                    "name": "CASED MULTI-POISE A COIL - ALUM",
                    "type": "indoorUnit"
                },
                {
                    "id": "59TP6B080V17--16",
                    "SKU": "59TP6B080V17--16",
                    "name": "96% 2-Spd 80k Furnace with PWM Motor",
                    "type": "furnace"
                }
            ],
            "equipmentTags": null,
            "AHRIReferences": [
                "203882543",
                "203359145"
            ],
            "availableRebates": null,
            "furnaceInputBTUH": 80000,
            "furnaceOutputBTUH": 77000,
            "coolingCapacityRated": 24400,
            "furnaceConfigurations": [
                "Downflow"
            ],
            "totalAvailableRebates": 1
        },
        {
            "EER": 13.00,
            "AFUE": 95.0,
            "HSPF": null,
            "SEER": 16.00,
            "Hcap17": null,
            "Hcap47": null,
            "fuelTypes": [
                "Natural Gas",
                "Propane Gas"
            ],
            "components": [
                {
                    "id": "24ACB724A003",
                    "SKU": "24ACB724A003",
                    "name": "Performance 17S 2-STG AC",
                    "type": "outdoorUnit"
                },
                {
                    "id": "CAPMP3017ALA",
                    "SKU": "CAPMP3017ALA",
                    "name": "CASED MULTI-POISE A COIL - ALUM",
                    "type": "indoorUnit"
                },
                {
                    "id": "59TP6B080V17--16",
                    "SKU": "59TP6B080V17--16",
                    "name": "96% 2-Spd 80k Furnace with PWM Motor",
                    "type": "furnace"
                }
            ],
            "equipmentTags": null,
            "AHRIReferences": [
                "203882444",
                "203359145"
            ],
            "availableRebates": null,
            "furnaceInputBTUH": 80000,
            "furnaceOutputBTUH": 77000,
            "coolingCapacityRated": 24200,
            "furnaceConfigurations": [
                "Downflow"
            ],
            "totalAvailableRebates": 2
        },
        {
            "EER": 13.00,
            "AFUE": 96.2,
            "HSPF": null,
            "SEER": 16.00,
            "Hcap17": null,
            "Hcap47": null,
            "fuelTypes": [
                "Natural Gas",
                "Propane Gas"
            ],
            "components": [
                {
                    "id": "24ACB724A003",
                    "SKU": "24ACB724A003",
                    "name": "Performance 17S 2-STG AC",
                    "type": "outdoorUnit"
                },
                {
                    "id": "CAPMP3617ALA",
                    "SKU": "CAPMP3617ALA",
                    "name": "CASED MULTI-POISE A COIL - ALUM",
                    "type": "indoorUnit"
                },
                {
                    "id": "59TP6B080V17--16",  
                    "SKU": "59TP6B080V17--16",
                    "name": "96% 2-Spd 80k Furnace with PWM Motor",
                    "type": "furnace"
                }
            ],
            "equipmentTags": null,
            "AHRIReferences": [
                "203882543",
                "203359139"
            ],
            "availableRebates": null,
            "furnaceInputBTUH": 80000,
            "furnaceOutputBTUH": 78000,
            "coolingCapacityRated": 24400,
            "furnaceConfigurations": [
                "Horizontal",
                "Upflow"
            ],
            "totalAvailableRebates": 3
        },
    ],
    [
        {
            "EER": 11.50,
            "AFUE": 95.0,
            "HSPF": null,
            "SEER": 14.00,
            "Hcap17": null,
            "Hcap47": null,
            "fuelTypes": [
                "Natural Gas",
                "Propane Gas"
            ],
            "components": [
                {
                    "id": "CA16NA03000G*",  
                    "SKU": "CA16NA03000G*",
                    "name": "16 SEER AC, SE & North Only",
                    "type": "outdoorUnit"
                },
                {
                    "id": "CAPMP3617ALA*",  
                    "SKU": "CAPMP3617ALA*",
                    "name": "CASED MULTI-POISE A COIL - ALUM",
                    "type": "indoorUnit"
                },
                {
                    "id": "59SC5B060E14--12*",
                    "SKU": "59SC5B060E14--12*",
                    "name": "95% 60k BTU Furnace with DTCT Motor",
                    "type": "furnace"
                }
            ],
            "equipmentTags": null,
            "AHRIReferences": [
                "203859104",
                "203924688"
            ],
            "availableRebates": null,
            "furnaceInputBTUH": 60000,
            "furnaceOutputBTUH": 58000,
            "coolingCapacityRated": 28200,
            "furnaceConfigurations": [
                "Downflow"
            ],
            "totalAvailableRebates": 101
        },
        {
            "EER": 11.50,
            "AFUE": 95.0,
            "HSPF": null,
            "SEER": 14.00,
            "Hcap17": null,
            "Hcap47": null,
            "fuelTypes": [
                "Natural Gas",
                "Propane Gas"
            ],
            "components": [
                {
                    "id": "CA16NA03000G*",
                    "SKU": "CA16NA03000G*",
                    "name": "16 SEER AC, SE & North Only",
                    "type": "outdoorUnit"
                },
                {
                    "id": "CAPMP3017ALA*",
                    "SKU": "CAPMP3017ALA*",
                    "name": "CASED MULTI-POISE A COIL - ALUM",
                    "type": "indoorUnit"
                },
                {
                    "id": "59SC5B060E14--12*",
                    "SKU": "59SC5B060E14--12*",
                    "name": "95% 60k BTU Furnace with DTCT Motor",
                    "type": "furnace"
                }
            ],
            "equipmentTags": null,
            "AHRIReferences": [
                "203859040",
                "203924688"
            ],
            "availableRebates": null,
            "furnaceInputBTUH": 60000,
            "furnaceOutputBTUH": 58000,
            "coolingCapacityRated": 28000,
            "furnaceConfigurations": [
                "Downflow"
            ],
            "totalAvailableRebates": 100
        }
    ],
    [
      {
        "EER": 12.50,
        "AFUE": 95.0,
        "HSPF": null,
        "SEER": 15.00,
        "Hcap17": null,
        "Hcap47": null,
        "fuelTypes": [
            "Natural Gas",
            "Propane Gas"
        ],
        "components": [
            {
                "id": "CA16NW02400G--",
                "SKU": "CA16NW02400G--",
                "name": "16 SEER / 12.2 EER SW AC",
                "type": "outdoorUnit"
            },
            {
                "id": "CAPMP2414ALA--",
                "SKU": "CAPMP2414ALA--",
                "name": "MULTI-POISE A COIL - ALUM",
                "type": "indoorUnit"
            },
            {
                "id": "59SC5B060E14--12--",
                "SKU": "59SC5B060E14--12--",
                "name": "95% 60k BTU Furnace with DTCT Motor",
                "type": "furnace"
            }
        ],
        "configurationOptions":[
          {
            "id": "Horizontal, Upflow",
            "name": "Horizontal, Upflow",
            "type": "furnaceConfiguration"
          }
        ],
        "equipmentTags": null,
        "AHRIReferences": [
            "203871621",
            "203924685"
        ],
        "availableRebates": null,
        "furnaceInputBTUH": 60000,
        "furnaceOutputBTUH": 58000,
        "coolingCapacityRated": 23400,
        "furnaceConfigurations": [
            "Horizontal",
            "Upflow"
        ],
        "totalAvailableRebates": null
    },
    {
      "EER": 12.50,
      "AFUE": 95.0,
      "HSPF": null,
      "SEER": 15.00,
      "Hcap17": null,
      "Hcap47": null,
      "fuelTypes": [
          "Natural Gas",
          "Propane Gas"
      ],
      "components": [
          {
              "id": "CA16NW02400G--",
              "SKU": "CA16NW02400G--",
              "name": "16 SEER / 12.2 EER SW AC",
              "type": "outdoorUnit"
          },
          {
              "id": "CAPMP2414ALA--",
              "SKU": "CAPMP2414ALA--",
              "name": "MULTI-POISE A COIL - ALUM",
              "type": "indoorUnit"
          },
          {
              "id": "59SC5B060E14--12--",
              "SKU": "59SC5B060E14--12--",
              "name": "95% 60k BTU Furnace with DTCT Motor",
              "type": "furnace"
          }
      ],
      "configurationOptions":[
        {
          "id": "Downflow",
          "name": "Downflow",
          "type": "furnaceConfiguration"
        }
      ],
      "equipmentTags": null,
      "AHRIReferences": [
          "203871621",
          "203924688"
      ],
      "availableRebates": null,
      "furnaceInputBTUH": 60000,
      "furnaceOutputBTUH": 58000,
      "coolingCapacityRated": 23400,
      "furnaceConfigurations": [
          "Downflow"
      ],
      "totalAvailableRebates": null
  },
  {
            "EER": 12.50,
            "AFUE": 95.0,
            "HSPF": null,
            "SEER": 15.00,
            "Hcap17": null,
            "Hcap47": null,
            "fuelTypes": [
                "Natural Gas",
                "Propane Gas"
            ],
            "components": [
                {
                    "id": "CA16NW02400G--",
                    "SKU": "CA16NW02400G--",
                    "name": "16 SEER / 12.2 EER SW AC",
                    "type": "outdoorUnit"
                },
                {
                    "id": "CAPMP2414ALA--",
                    "SKU": "CAPMP2414ALA--",
                    "name": "MULTI-POISE A COIL - ALUM",
                    "type": "indoorUnit"
                },
                {
                    "id": "59TP6B060V14--12--",
                    "SKU": "59TP6B060V14--12--",
                    "name": "96% 2-Spd 60k Furnace with PWM Motor",
                    "type": "furnace"
                }
            ],
            "equipmentTags": null,
            "AHRIReferences": [
                "203871631",
                "203924810"
            ],
            "availableRebates": null,
            "furnaceInputBTUH": 60000,
            "furnaceOutputBTUH": 58000,
            "coolingCapacityRated": 23400,
            "furnaceConfigurations": [
                "Horizontal",
                "Upflow"
            ],
            "totalAvailableRebates": null
        },
    ]
  ]

  oneCard: Array<BestDetail> = []; // el conrenido de cada tarjeta
/*   myOptionsIndoor:Array<string> = [];
  myOptionsfurnace:Array<string> = []; */

  allCard: Array<BestDetail> = []; // se usara para recorrer las targeras

  constructor( ) { }

  ngOnInit(): void {

    this.results = this.raw // asignando la respuesta del enpoint search al modelo, con this.results

    this.totalRebateMax();
  }

  /* pasos:
    1. primero se asigna a la variable results todo el payload optenido del enpoint search
    2. se optiene el mayor revate de cada grupo de outdoor unit, se guarda en la variable oneCard
    3. se agrega a los campos optionsIndoorsToSelect y optionsfurnaceUnitsToSelect, todas las opciones disponibles de cada unidad
    4. se ordena oneCard de mayor a menor rebate, para que sean mostrados en la interfaz de mayor a menor 

    notas:
    4. se debe de implementar la parte en la que si hay mas de 2 combinaciones por unidades, el usuario debe de seleccionar la configuracion para poder ver resultados
          IDEA -> * se debe de buscar en el results todas las coencidencias para ourddor, indoor y furnace, y guargar en un campo llamado "todas la coencidencias"; si en el arreglo "todas la coencidencias" hay mas de un elemento, entonces se debe de mostrar el select
                    de las configuraciones, por defecto se mostrara el primer elemento del campo "todas la coencidencias"
                  * en el select de las configuraciones de puede poner el valor del rebate de cada configuracion, para mayor commodidad del usuario
   */

  totalRebateMax(){
    
    // recorriendo toda la respuesta del search
    this.results.forEach(element => {
      // debuelve los resultados ordenamos del maxino al minimo
      let max =  element.sort((a: any, b:any) =>{
        return Number.parseInt(b.totalAvailableRebates) - Number.parseInt(a.totalAvailableRebates)
      }) ;
      this.oneCard.push(max[0]);; // colocando el maximo de cada grupo a cada card
    });  
    
    this.getUnitOptionstoSelect2();

    this.searchUnits();

    return this.sortDescendingOneCard();
  }

  searchUnits(){

    // variables to save the unit id to current card
    let myOutdoorUnit: string = '';
    let myIndoorUnit: string = '';
    let myfurnace: string = '';
  
    // variables that save unit searches in results
    let myEqualUnitsOutdoors: any = [];
    let myEqualUnitsIndoors: any = [];
    let myEqualUnitsfurnace:any = [];
  
  
    /* looping through results */
    this.oneCard.forEach((element:any) => {
    
      myOutdoorUnit = '';
      myIndoorUnit = '';
      myfurnace = '';
      myEqualUnitsOutdoors = [];
      myEqualUnitsIndoors = [];
      myEqualUnitsfurnace = [];
      
    
      // save the value of units
      element.components.forEach((ele1:any) => {
        switch (ele1.type) {
          case 'outdoorUnit':
            myOutdoorUnit = ele1.id;
            break;
          case 'indoorUnit':
            myIndoorUnit = ele1.id;
            break;
          case 'furnace':
            myfurnace = ele1.id;
            break;
        }
      });
    
      // se buscar entro de this.results todos los registros con el mismo aoutddor unit
      myEqualUnitsOutdoors = this.searchOutdoortUnit(myOutdoorUnit);
    
      // busca las combinaciones para el resto de tipo de unidades
      if (myfurnace != '' && myIndoorUnit === ''){
        myEqualUnitsfurnace = this.searchComponetUnit(myEqualUnitsOutdoors, 'furnace', myfurnace);
        element.equalUnits = myEqualUnitsfurnace;
        element.lengthEqualUnits = myEqualUnitsfurnace.length;
      } else if (myIndoorUnit != '' && myfurnace == ''){
        myEqualUnitsIndoors = this.searchComponetUnit(myEqualUnitsOutdoors, 'indoorUnit', myIndoorUnit);
        element.equalUnits = myEqualUnitsIndoors;
        element.lengthEqualUnits = myEqualUnitsIndoors.length;
      } else if (myfurnace != '' && myIndoorUnit != '') {
        myEqualUnitsfurnace = this.searchComponetUnit(myEqualUnitsOutdoors, 'furnace', myfurnace);

        myEqualUnitsIndoors = this.searchComponetUnit(myEqualUnitsfurnace, 'indoorUnit', myIndoorUnit);
        element.equalUnits = myEqualUnitsIndoors;
        element.lengthEqualUnits = myEqualUnitsIndoors.length;
      } else {
        let message = 'error';
      }


    
    });

    return this.oneCard;
  }

  searchOutdoortUnit(myIDUnitToSearch: string){

    let myOutdoors: any = [];

    this.results.forEach((subel:BestDetail[]) => {
      subel.forEach(ele2 => {
        let myFind = ele2.components?.filter((item: any)=> item.type == "outdoorUnit")[0].SKU;
        if(myFind == myIDUnitToSearch){
          myOutdoors = subel
        }
      });
      
    });

    return myOutdoors;

  }

  /* 
  busca entro de la collecion de datos todas las unidades que coinsiden con el id que buscamos

  nota:
    collectionData -> la funte de datos
    unitType -> outdoor, indoor, furnace
    myUnitToSearch -> el id de la unidad a nucar
  */
  searchComponetUnit(collectionData:any, unitType: string, myIDUnitToSearch: string){

    let myEqualUnit: any = [];

    collectionData.forEach((conbination:any) => {
      let myFind = conbination.components?.filter((item: any)=> item.type === unitType)[0].id;
      if(myFind === myIDUnitToSearch){
        myEqualUnit.push(conbination);
      }
    });

    return myEqualUnit;

  }

  getUnitOptionstoSelect2(){

    let myOptionsIndoor:Array<string> = [];
    let myOptionsfurnace:Array<string> = [];

    // reecortiendo oneCard
    for (let i = 0; i < this.oneCard.length; i++) {
      
      // limpienado las variables, cada ves que salte de aoutdoor
      myOptionsIndoor = [];
      myOptionsfurnace = [];

      // recortiendo results para obtener los components
      this.results[i].forEach((everyCombinationOutdoor:any) => {
        everyCombinationOutdoor.components.forEach((eachComponent:any) => {
          switch (eachComponent.type) {
            case 'indoorUnit':
              myOptionsIndoor.push(eachComponent.id);
              break;
            case 'furnace':
              myOptionsfurnace.push(eachComponent.id);
              break;
          } 
        });
      });

      this.oneCard[i].optionsIndoorsToSelect = this.deleteDuplicateUnitSelect(myOptionsIndoor);
      this.oneCard[i].optionsfurnaceUnitsToSelect = this.deleteDuplicateUnitSelect(myOptionsfurnace);
    }

  }

  deleteDuplicateUnitSelect(idUnit: Array<string>){

    let uniqueUnit = idUnit.filter((item,index) => {
      return idUnit.indexOf(item) ===index;
    });

    return uniqueUnit;
  }


  sortDescendingOneCard(){

    let newOrder = this.oneCard.sort((a: any, b:any) =>{
      return Number.parseInt(b.totalAvailableRebates) - Number.parseInt(a.totalAvailableRebates)
    }) ;

    this.oneCard = newOrder;

    console.log(this.oneCard);
  }

}



