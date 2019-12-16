export class Material {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class MaterialConversion {
  consumes: MaterialQuantity[];
  produces: MaterialQuantity;
  baseConversion: boolean;

  constructor(baseConversion = false) {
    this.consumes = [];
    this.baseConversion = baseConversion;
  }
}

export class MaterialQuantity {
  quantity: number;
  material: Material;

  constructor(quantity: number, material: Material) {
    this.quantity = quantity;
    this.material = material;
  }

  adjust(amount: number) {
    this.quantity += amount;
  }
}

export interface MaterialsLibrary {
  materials: Map<string, Material>;
  conversions: MaterialConversion[];
}

export class MaterialsFactory {
  private leftSide(formula: string) {
    return formula.split(' => ')[0];
  }

  private rightSide(formula: string) {
    return formula.split(' => ')[1];
  }

  private quantity(quanitytDefinition: string) : number {
    return parseInt(quanitytDefinition.split(' ')[0]);
  }

  private materialName(quanitytDefinition: string) : string {
    return quanitytDefinition.split(' ')[1];
  }

  private material(quanitytDefinition: string, materialsMap: Map<string, Material>) : Material {
    return materialsMap.get(this.materialName(quanitytDefinition));
  }

  private buildMap(formulas : string[]) : Map<string, Material> {
    const map = new Map<string, Material>();

    map.set('ORE', new Material('ORE'));

    formulas.forEach((formula) => {
      const rightSide = this.rightSide(formula);
      const name = this.materialName(rightSide);
      map.set(name, new Material(name));
    });

    return map;
  }

  private setupProductionRelationship(formulas: string[], materialsMap: Map<string, Material>) : MaterialConversion[] {
    const conversions : MaterialConversion[] = [];
    const ore = materialsMap.get('ORE');
    
    formulas.forEach((formula) => {
      const leftSide = this.leftSide(formula);
      const rightSide = this.rightSide(formula);

      const material = this.material(rightSide, materialsMap);
      const produces = this.quantity(rightSide);

      const conversion = new MaterialConversion();
      conversions.push(conversion);
      conversion.produces = new MaterialQuantity(produces, material);

      leftSide.split(',').map(s => s.trim()).forEach((leftPart) => {
        const quantityPart = this.quantity(leftPart);
        const materialPart = this.material(leftPart, materialsMap);

        if (materialPart === ore) {
          conversion.baseConversion = true;
        }

        conversion.consumes.push(new MaterialQuantity(quantityPart, materialPart));
      });
    });

    return conversions;
  }

  build(formulas : string[]) : MaterialsLibrary {
    const materialsMap = this.buildMap(formulas);
    const conversions = this.setupProductionRelationship(formulas, materialsMap);
    return {
      materials: materialsMap,
      conversions: conversions
    };
  }
}

export class MaterialConverter {
  private setupQuantityMap(materials: Map<string, Material>) : Map<Material, number> {
    const map = new Map<Material, number>();
    materials.forEach((material) => {
      map.set(material, 0);
    });
    return map;
  }

  private findOre(materials: Map<string, Material>) : Material {
    return materials.get('ORE');
  }

  private findFuel(materials: Map<string, Material>) : Material {
    return materials.get('FUEL');
  }

  private findConversionForMaterial(material: Material, conversions: MaterialConversion[]) {
    return conversions.find(c => c.produces.material === material);
  }

  private fullyReduced(ore: Material, neededCommodities: Map<Material, number>, conversions: MaterialConversion[]) : boolean {
    let fullyReduced = true;
    neededCommodities.forEach((quantity, material) => {
      if (quantity === 0 || material === ore) {
        return;
      }
      const conversion = this.findConversionForMaterial(material, conversions);
      if (!conversion.baseConversion) {
        fullyReduced = false;
      }
    });
    return fullyReduced;
  }

  private preformReduction(material: Material, quantity: number, materialsLibrary: MaterialsLibrary, neededCommodities: Map<Material, number>, leftoverCommodities: Map<Material, number>, ore: Material, skipBase = true) {
    if (quantity === 0) {
      return;
    }
    if (material === ore) {
      return;
    }

    // console.log(`Looking to produce ${material.name}`);

    const conversion = this.findConversionForMaterial(material, materialsLibrary.conversions);
    if (conversion.baseConversion && skipBase) {
      return;
    }

    let neededAmount = quantity;
    let leftoverAmount = leftoverCommodities.get(material);
    if (leftoverAmount > 0) {
      if (leftoverAmount >= neededAmount) {
        neededAmount = 0;
        leftoverCommodities.set(material, leftoverAmount - neededAmount);
      } else {
        neededAmount -= leftoverAmount;
        leftoverCommodities.set(material, 0);
      }
    }

    const timesNeeded = Math.ceil(neededAmount / conversion.produces.quantity);

    for (let time = 0; time < timesNeeded; time += 1) {
      conversion.consumes.forEach((consumed) => {
        neededCommodities.set(consumed.material, neededCommodities.get(consumed.material) + consumed.quantity);
      });
    }

    const produced = timesNeeded * conversion.produces.quantity;
    if (produced > neededAmount) {
      leftoverCommodities.set(material, produced - neededAmount);
    }
    neededCommodities.set(material, 0);
  }

  oreForFuel(materialsLibrary: MaterialsLibrary) : number {
    const fuel = this.findFuel(materialsLibrary.materials);
    const ore = this.findOre(materialsLibrary.materials);

    const neededCommodities = this.setupQuantityMap(materialsLibrary.materials);
    const leftoverCommodities = this.setupQuantityMap(materialsLibrary.materials);

    const fuelConversion = this.findConversionForMaterial(fuel, materialsLibrary.conversions);

    fuelConversion.consumes.forEach((materialQuantity) => {
      neededCommodities.set(materialQuantity.material, neededCommodities.get(materialQuantity.material) + materialQuantity.quantity);
    });

    // Reduce down to just the elements directly produced from ore
    while (!this.fullyReduced(ore, neededCommodities, materialsLibrary.conversions)) {
      neededCommodities.forEach((quantity, material) => {
        this.preformReduction(material, quantity, materialsLibrary, neededCommodities, leftoverCommodities, ore);
      });
    }

    // Perform one last set of reductions
    neededCommodities.forEach((quantity, material) => {
      this.preformReduction(material, quantity, materialsLibrary, neededCommodities, leftoverCommodities, ore, false);
    });

    return neededCommodities.get(ore);
  }
}
