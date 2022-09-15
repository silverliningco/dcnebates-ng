// allRows represents all of the rows for a specific card, not filtered.
// allRows representa todas las filas de una tarjeta específica, sin filtrar.
var allRows = [];

// mySelections represents any components selected by the user for a specific card.
// mySelections representa cualquier componente seleccionado por el usuario para una tarjeta específica.
var mySelections = [];


// findComponentInRow attempts to find the component with type equal to componentType in someRow.
// If no component is found with the specified type, the function returns null.
// findComponentInRow intenta encontrar el componente con un tipo igual a componenteType en someRow.
// Si no se encuentra ningún componente con el tipo especificado, la función devuelve nulo.
function findComponentInRow(componentType, someRow) {

    for (var indx = 0; indx < someRow.components.length; indx++) {
        if (someRow.components[indx].componentType == componentType) {
            // Sweet, we found the desired component.
            return someRow.components[indx];
        }
    }

    // someRow does not have a component with type equal to componentType.
    // someRow no tiene un componente con un tipo igual a componenteType.
    return null;
}


// rowIsAvailable? checks if someRow combines with the user inputs represented by mySelections.
// We disregard any user input for the component with type equal to omitComponentType.
// ¿la fila está disponible? comprueba si someRow se combina con las entradas del usuario representadas por mySelections.
// Ignoramos cualquier entrada del usuario para el componente con un tipo igual a omitComponentType.
function rowIsAvailable(someRow, mySelections, omitComponentType) {

    // Loop through each component selection previously made by the user.
    // Recorrer la selección de cada componente realizada previamente por el usuario.
    for (var indx = 0; indx < mySelections.length; indx++) {

        if (mySelections[indx].componentType == omitComponentType) {

            // Do nothing, the loop will continue with the next user selection.
            // The available options in any dropdown should not be affected by the user's selection for that component.
            // Without this if clause the options in any dropdown where the user has already made a selection would be reduced to a single row.
            // No haga nada, el bucle continuará con la siguiente selección del usuario.
            // Las opciones disponibles en cualquier menú desplegable no deberían verse afectadas por la selección del usuario para ese componente.
            // Sin esta cláusula if, las opciones en cualquier menú desplegable donde el usuario ya haya hecho una selección se reducirían a una sola fila.
            continue;

        } else {

            // someRow may or may not have a component with the same type as mySelections[indx].
            // If someRow does have a component with the same type as mySelections[indx], the SKU of that component must be the same as the SKU of mySelections[indx].
            // someRow puede o no tener un componente con el mismo tipo que mySelections[indx].
             // Si someRow tiene un componente con el mismo tipo que mySelections[indx], el SKU de ese componente debe ser el mismo que el SKU de mySelections[indx].
            var matchingComponent = findComponentInRow(mySelections[indx].componentType, someRow);
            if (matchingComponent) {

                // someRow does have a component with the same type as mySelections[indx].
                // someRow tiene un componente con el mismo tipo que mySelections[indx].
                if (mySelections[indx].sku != matchingComponent.sku) {
                    // This row does not combine with previously selected components.
                    // Esta fila no se combina con componentes previamente seleccionados.
                    return false;
                } else {
                    // The user's selection for this component is compatible with someRow.
                    // Nothing else to do here, the loop will continue evaluating remaining user inputs, if any.
                    // La selección del usuario para este componente es compatible con someRow.
                    // No hay nada más que hacer aquí, el ciclo continuará evaluando las entradas restantes del usuario, si las hay.
                }

            } else {

                // someRow does not have a component with the same type as mySelections[indx]
                // Nothing else to do here.
                // someRow no tiene un componente con el mismo tipo que mySelections[indx]
                // No hay nada más que hacer aquí.

            }

        }

    }

    // All selections previously made by the user (other than the one for omitComponentType which we disregard) combine with the SKUs of someRow.
    return true;

}


// availableComponents returns all components of componentType that are compatible with user inputs represented by mySelections.
function availableComponents(componentType, allRows, mySelections) {

    var myResults = [];

    // Loop through all rows for this card.
    for (var indx = 0; indx < myRows.length; indx++) {

        // Check if the components for myRows[indx] - other than the component corresponding to componentType - are compatible with previous user inputs.
        if (rowIsAvailable(myRows[indx], mySelections, componentType)) {
            // This row does combine with previous user inputs to the SKU for componentType can be shown in the dropdown.
            myResults[myResults.length] = findComponentInRow(componentType, myRows[indx]);
        } else {
            // This row does not combine with previous user inputs so we should not show the SKU for componentType in the dropdown.
        }

    }

    // The results returned here are not unique nor ordered.
    // To-do: filter for unique results...
    // To-do: order by SKU ...
    return myResults;

}