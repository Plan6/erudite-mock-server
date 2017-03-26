#!/bin/bash

echo >> log.txt
echo `date` >> log.txt
echo ================================== >> log.txt

exec npm start >> log.txt

