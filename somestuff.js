// allRows represents all of the rows for a specific card, not filtered.
var allRows = [];

// mySelections represents any components selected by the user for a specific card.
var mySelections = [];


// findComponentInRow attempts to find the component with type equal to componentType in someRow.
// If no component is found with the specified type, the function returns null.
function findComponentInRow(componentType, someRow) {

    for (var indx = 0; indx < someRow.components.length; indx++) {
        if (someRow.components[indx].componentType == componentType) {
            // Sweet, we found the desired component.
            return someRow.components[indx];
        }
    }

    // someRow does not have a component with type equal to componentType.
    return null;
}


// rowIsAvailable? checks if someRow combines with the user inputs represented by mySelections.
// We disregard any user input for the component with type equal to omitComponentType.
function rowIsAvailable?(someRow, mySelections, omitComponentType) {

    // Loop through each component selection previously made by the user.
    for (var indx = 0; indx < mySelections.length; indx++) {

        if (mySelections[indx].componentType == omitComponentType) {

            // Do nothing, the loop will continue with the next user selection.
            // The available options in any dropdown should not be affected by the user's selection for that component.
            // Without this if clause the options in any dropdown where the user has already made a selection would be reduced to a single row.
            continue;

        } else {

            // someRow may or may not have a component with the same type as mySelections[indx].
            // If someRow does have a component with the same type as mySelections[indx], the SKU of that component must be the same as the SKU of mySelections[indx].
            var matchingComponent = findComponentInRow(mySelections[indx].componentType, someRow);
            if (matchingComponent) {

                // someRow does have a component with the same type as mySelections[indx].
                if (mySelections[indx].sku != matchingComponent.sku) {
                    // This row does not combine with previously selected components.
                    return false;
                } else {
                    // The user's selection for this component is compatible with someRow.
                    // Nothing else to do here, the loop will continue evaluating remaining user inputs, if any.
                }

            } else {

                // someRow does not have a component with the same type as mySelections[indx]
                // Nothing else to do here.

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
        if (rowIsAvailable(myRows[indx], mySelections, componentType) {
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