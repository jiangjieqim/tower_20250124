call loadlib.bat %1
cd %QATOOLS%
node create_release_template.js --trunk "%CURPROJECT%\Client\trunk" --release "release"