#!/bin/bash
echo "Fazendo push para contatotrapstore/neurogame..."
git remote add trap https://github.com/contatotrapstore/neurogame.git 2>/dev/null || echo "Remote já existe"
git push trap master --force
git push trap v1.0.9
echo "Push concluído!"
