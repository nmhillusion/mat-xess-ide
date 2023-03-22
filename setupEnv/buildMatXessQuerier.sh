#!/bin/bash

echo ">> BUILD MAT XESS QUERIER >>"

while getopts "r:p:o:j:l:" flag
do
  case "${flag}" in
    r) repoUrl=${OPTARG};;
    p) matXessQuerierPath=${OPTARG};;
    o) originJarFileName=${OPTARG};;
    j) jarFileName=${OPTARG};;
    l) externalLibPath=${OPTARG};;
  esac
done

echo "repoUrl=${repoUrl}"
echo "matXessQuerierPath=${matXessQuerierPath}"
echo "originJarFileName=${originJarFileName}"
echo "jarFileName=${jarFileName}"
echo "externalLibPath=${externalLibPath}"

rm -rf $matXessQuerierPath && git clone $repoUrl $matXessQuerierPath
cd $matXessQuerierPath && mvn clean compile package -Dmaven.test.skip=true

if [ ! -d "$externalLibPath" ] 
then
  echo ">> $externalLibPath does not exist >> CREATE"
  mkdir -p $externalLibPath
else
  echo ">> $externalLibPath exists >> DO NOT CREATE"
fi

cp "$matXessQuerierPath/target/$originJarFileName" $externalLibPath && cd $externalLibPath && mv $originJarFileName $jarFileName

echo "<< BUILD MAT XESS QUERIER << DONE"