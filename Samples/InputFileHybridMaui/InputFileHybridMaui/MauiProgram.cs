using Microsoft.Extensions.Logging;
using InputFileHybridMaui.Shared.Services;
using InputFileHybridMaui.Services;
#if MAUI_DEVFLOW
using Microsoft.Maui.DevFlow.Agent;
using Microsoft.Maui.DevFlow.Blazor;
#endif

namespace InputFileHybridMaui;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
    #if MAUI_DEVFLOW
        builder.AddMauiDevFlowAgent();
        builder.AddMauiBlazorDevFlowTools();
    #endif
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
            });

        // Add device-specific services used by the InputFileHybridMaui.Shared project
        builder.Services.AddSingleton<IFormFactor, FormFactor>();

        builder.Services.AddMauiBlazorWebView();

#if DEBUG
        builder.Services.AddBlazorWebViewDeveloperTools();
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
