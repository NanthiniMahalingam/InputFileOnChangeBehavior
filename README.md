# InputFile OnChange when the user cancels the file picker

Validation Scenario: https://github.com/dotnet/aspnetcore/issues/68820

## Build tested
```
.NET SDK 11.0.100-preview.7.26381.103
```
The scenario requires .NET 11 Preview 7 or later.

## Sample application for Blazor web app
This repository contains a Blazor Web App using Interactive Server rendering for the validation page.


Start at /input-file-onchange-test to access the complete sample set.

### How to Run

From the Samples/InputFileOnChange root

```
dotnet run --project .\InputFileOnChange.csproj --launch-profile http
```

Open at url 
```
http://localhost:5240/
```

## Sample application for Hybrid maui
This repository contains .NET MAUI Blazor Hybrid and Web App which runs on windows, android, iOS and mac platform. 

You can run the sample directly on Visual studio 2026 preview.
