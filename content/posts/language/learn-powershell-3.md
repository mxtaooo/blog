---
title: Learn Windows PowerShell 3 in a Month of Lunches - Review lab 1 (chapters 1–6)
description: Learn Windows PowerShell 3 in a Month of Lunches - Review lab 1 (chapters 1–6)
categories: ["language"]
tags: ["powershell"]
author: mxtao
date: 2017-08-14
---

# Learn Windows PowerShell 3 in a Month of Lunches - Review lab 1 (chapters 1–6)

NOTE: To complete this lab, you will need any computer running PowerShell v3. You should complete the labs in chapters 1 through 6 of this book prior to attempting this review lab.

+ HINTS :

  + Sort-Object
  + Select-Object
  + Import-Module
  + Export-CSV
  + Help
  + Get-ChildItem (Dir)

---

+ TASK 1

    Run a command that will display the newest 100 entries from the Application event log. Do not use `Get-WinEvent`

    ```powershell
    Get-EventLog -LogName Application -Newest 10
    ```

+ TASK 2

    Write a command line that displays only the five top processes based on virtual memory (VM) usage.

    ```powershell
    Get-Process | Sort-Object -Property VM -Descending | Select-Object -First 5
    ```

+ TASK 3

    Create a CSV file that contains all services, including only the service names and statuses. Have running services listed before stopped services.

    ```powershell
    Get-Service | Sort-Object -Property Status -Descending | Select-Object -Property Name,Status | Export-Csv -Path C:\service.csv
    ```

+ TASK 4

    Write a command line that changes the startup type of the BITS service to Manual

    ```powershell
    Set-Service -Name BITS -StartupType Manual
    ```

+ TASK 5

    Display a list of all files named win. on your computer. Start in the `C:\folder`.

    Note: you may need to experiment and use some new parameters of a cmdlet in order to complete this task.

    ```powershell
    Get-ChildItem C:\ -Filter win*.* -File -Recurse
    ```

+ TASK 6

    Get a directory listing for `C:\Program Files`. Include all subfolders, and have the directory listing go into a text file named C:\Dir.txt (remember to use the `>` redirector, or the `Out-File` cmdlet).

    ```powershell
    Get-ChildItem 'C:\Program Files' -Recurse -Directory > C:\dir.txt
    ```

+ TASK 7

    Get a list of the most recent 20 entries from the Security event log, and convert the information to XML . Do not create a file on disk: have the XML display in the console window.

    Note that the XML may display as a single top-level object, rather than as raw XML data—that’s fine. That’s just how PowerShell displays XML . You can pipe the XML object to `Format-Custom` to see it expanded out into an object hierarchy, if you like.

    ```powershell
    Get-EventLog -LogName Security -Newest 20 | ConvertTo-Xml
    ```

+ TASK 8

    Get a list of services, and export the data to a CSV file named C:\services.csv.

    ```powershell
    Get-Service | Export-Csv C:\services.csv
    ```

+ TASK 9

    Get a list of services. Keep only the services’ names, display names, and statuses, and send that information to an HTML file. Have the phrase “Installed Services” displayed in the HTML file before the table of service information.

    ```powershell
    Get-Service | Select-Object -Property Name,Status,DisplayName | ConvertTo-Html -PreContent "Installed Services" | Out-File C:\services.html
    ```

+ TASK 10

    Create a new alias, named `D` , which runs `Get-ChildItem`. Export just that alias to a file.

    Now, close the shell and open a new console window. Import that alias into the shell.

    Make sure you can run `D` and get a directory listing.

    ```powershell
    New-Alias -Name D -Value Get-ChildItem
    Export-Alias -Path C:\alias.xml -Name D
    # reopen ps
    Import-Alias -Path C:\alias.xml
    ```

+ TASK 11

    Display a list of event logs that are available on your system.

    ```powershell
    Get-EventLog -List
    ```

+ TASK 12

    Run a command that will display the current directory that the shell is in.

    ```powershell
    pwd
    # or
    Get-Location
    # or
    gl
    ```

+ TASK 13

    Run a command that will display the most recent commands that you have run in the shell. Locate the command that you ran for task 11. Using two commands connected by a pipeline, rerun the command from task 11.

    In other words, if `Get-Something` is the command that retrieves historical commands, if 5 is the ID number of the command from task 11, and `Do-Something` is the command that runs historical commands, run this:

    `Get-Something –id 5 | Do-Something`

    Of course, those aren’t the correct cmdlet names—you’ll need to find those. Hint: both commands that you need have the same noun.

    ```powershell
    Get-History -Id 6 | Invoke-History
    ```

+ TASK 14

    Run a command that modifies the Security event log to overwrite old events as needed.

    ```powershell
    Limit-EventLog -LogName Security -OverflowAction OverwriteAsNeeded
    ```

+ TASK 15

    Use the `New-Item` cmdlet to make a new directory named `C:\Review`. This is not the same as running `Mkdir` ; the `New-Item` cmdlet will need to know what kind of new item you want to create. Read the help for the cmdlet.

    ```powershell
    New-Item -Path C:\Review -ItemType Directory
    ```

+ TASK 16

    Display the contents of this registry key: HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders

    Note: “User Shell Folders” is not exactly like a directory. If you change into that “directory,” you won’t see anything in a directory listing. User Shell Folders is an item, and what it contains are item properties. There’s a cmdlet capable of displaying item properties (although cmdlets use singular nouns, not plural).

    ```powershell
    Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders'
    ```

+ TASK 17

    Find (but please do not run) cmdlets that can…

    + Restart a computer
    + Shut down a computer
    + Remove a computer from a workgroup or domain
    + Restore a computer’s System Restore checkpoint

    ```powershell
    help *computer*
    ```

+ TASK 18

    What command do you think could change a registry value? Hint: it’s the same noun as the cmdlet you found for task 16.

    ```powershell
    Set-ItemProperty
    ```
