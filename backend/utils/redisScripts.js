const lockSeatsLua = `
for i = 1, #KEYS do
  local key = KEYS[i]
  local userId = ARGV[1]
  local ttl = tonumber(ARGV[2])

  local current = redis.call("GET", key)

  if current and current ~= userId then
    return 0
  end
end

for i = 1, #KEYS do
  redis.call("SET", KEYS[i], ARGV[1], "EX", tonumber(ARGV[2]), "NX")
end

return 1
`;

module.exports = { lockSeatsLua };